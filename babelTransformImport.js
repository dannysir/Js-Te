export const babelTransformImport = ({types: t}) => {
  return {
    visitor: {
      Program(path) {
        const importStatement = t.ImportDeclaration(
          [t.importSpecifier(
            t.identifier('__mockRegistry__'),
            t.identifier('__mockRegistry__')
          )],
          t.stringLiteral('@dannysir/js-te/src/mock/store.js')
        );
        path.node.body.unshift(importStatement);
      },

      ImportDeclaration(path) {
        const source = path.node.source.value;

        if (source === '@dannysir/js-te/src/mock/store.js') {
          return;
        }

        const specifiers = path.node.specifiers;

        // 1. 먼저 모듈을 한 번만 가져오기 (mock이면 mock, 아니면 실제)
        const moduleVarName = path.scope.generateUidIdentifier('module');

        const moduleDeclaration = t.variableDeclaration('const', [
          t.variableDeclarator(
            moduleVarName,
            t.conditionalExpression(
              // 조건: __mockRegistry__.has(source)
              t.callExpression(
                t.memberExpression(t.identifier('__mockRegistry__'), t.identifier('has')),
                [t.stringLiteral(source)]
              ),
              // true: mock 반환
              t.callExpression(
                t.memberExpression(t.identifier('__mockRegistry__'), t.identifier('get')),
                [t.stringLiteral(source)]
              ),
              // false: 실제 import
              t.awaitExpression(
                t.importExpression(t.stringLiteral(source))
              )
            )
          )
        ]);

        // 2. 각 specifier를 moduleVarName에서 추출
        const extractDeclarations = specifiers.map(spec => {
          let importedName, localName;

          if (t.isImportDefaultSpecifier(spec)) {
            importedName = 'default';
            localName = spec.local.name;
          } else if (t.isImportNamespaceSpecifier(spec)) {
            localName = spec.local.name;
            // namespace import는 전체 모듈
            return t.variableDeclarator(
              t.identifier(localName),
              moduleVarName
            );
          } else {
            importedName = spec.imported.name;
            localName = spec.local.name;
          }

          return t.variableDeclarator(
            t.identifier(localName),
            t.memberExpression(moduleVarName, t.identifier(importedName))
          );
        });

        const extractDeclaration = t.variableDeclaration('const', extractDeclarations);

        path.replaceWithMultiple([moduleDeclaration, extractDeclaration]);
      }
    }
  };
};