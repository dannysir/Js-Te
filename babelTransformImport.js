import path from 'path';
import {BABEL, MOCK} from "./constants.js";

export const babelTransformImport = ({types: t}) => {
  return {
    visitor: {
      Program(path) {
        const importStatement = t.ImportDeclaration(
          [t.importSpecifier(
            t.identifier(MOCK.STORE_NAME),
            t.identifier(MOCK.STORE_NAME)
          )],
          t.stringLiteral(MOCK.STORE_PATH)
        );
        path.node.body.unshift(importStatement);
      },

      ImportDeclaration(nodePath, state) {
        const source = nodePath.node.source.value;

        if (source === MOCK.STORE_PATH) {
          return;
        }

        const currentFilePath = state.filename || process.cwd();
        const currentDir = path.dirname(currentFilePath);

        let absolutePath;
        if (source.startsWith(BABEL.PERIOD)) {
          absolutePath = path.resolve(currentDir, source);
        } else {
          absolutePath = source;
        }

        const specifiers = nodePath.node.specifiers;

        const moduleVarName = nodePath.scope.generateUidIdentifier(BABEL.MODULE);

        const moduleDeclaration = t.variableDeclaration(BABEL.CONST, [
          t.variableDeclarator(
            moduleVarName,
            t.conditionalExpression(
              t.callExpression(
                t.memberExpression(t.identifier(MOCK.STORE_NAME), t.identifier(BABEL.HAS)),
                [t.stringLiteral(absolutePath)]
              ),
              t.callExpression(
                t.memberExpression(t.identifier(MOCK.STORE_NAME), t.identifier(BABEL.GET)),
                [t.stringLiteral(absolutePath)]
              ),
              t.awaitExpression(
                t.importExpression(t.stringLiteral(source))
              )
            )
          )
        ]);

        const extractDeclarations = specifiers.map(spec => {
          let importedName, localName;

          if (t.isImportDefaultSpecifier(spec)) {
            importedName = 'default';
            localName = spec.local.name;
          } else if (t.isImportNamespaceSpecifier(spec)) {
            localName = spec.local.name;
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

        const extractDeclaration = t.variableDeclaration(BABEL.CONST, extractDeclarations);

        nodePath.replaceWithMultiple([moduleDeclaration, extractDeclaration]);
      }
    }
  };
};