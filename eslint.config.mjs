import js from "@eslint/js";
import angular from "angular-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"dist/**",
			"out-tsc/**",
			"coverage/**",
			".angular/**",
			".firebase/**",
			"node_modules/**",
			"functions/**",
			"public/**",
			"spike/**"
		]
	},
	{
		files: ["**/*.ts"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			tseslint.configs.stylistic,
			angular.configs.tsRecommended,
			sonarjs.configs.recommended
		],
		processor: angular.processInlineTemplates,
		rules: {
			"@angular-eslint/component-selector": [
				"error",
				{ type: "element", prefix: "app", style: "kebab-case" }
			],
			"@angular-eslint/directive-selector": [
				"error",
				{ type: "attribute", prefix: "app", style: "camelCase" }
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
			],
			"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			eqeqeq: ["error", "smart"],
			"prefer-const": "error",
			"sonarjs/todo-tag": "off",
			"sonarjs/no-commented-code": "off"
		}
	},
	{
		files: ["**/*.spec.ts"],
		rules: {
			"sonarjs/no-nested-functions": "off",
			"@typescript-eslint/no-non-null-assertion": "off"
		}
	},
	{
		files: ["src/server.ts", "src/main.server.ts", "scripts/**/*.mjs"],
		languageOptions: { globals: globals.node },
		rules: { "no-console": "off" }
	},
	{
		files: ["**/*.mjs"],
		extends: [js.configs.recommended],
		languageOptions: {
			sourceType: "module",
			globals: globals.node
		}
	},
	{
		files: ["**/*.js"],
		extends: [js.configs.recommended],
		languageOptions: {
			sourceType: "commonjs",
			globals: globals.node
		}
	},
	{
		files: ["**/*.html"],
		extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
		rules: {
			"@angular-eslint/template/prefer-control-flow": "error",
			"@angular-eslint/template/prefer-self-closing-tags": "error"
		}
	}
);
