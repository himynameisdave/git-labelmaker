import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
    {
		input: 'src/index.js',
        external: Object.keys(pkg.dependencies),
		output: [
			{
				file: pkg.main,
                format: 'cjs',
				banner: '#!/usr/bin/env node',
				exports: 'named',
            },
		],
		plugins: [
            resolve(),
			commonjs(),
			babel({
				exclude: ['node_modules/**'],
			}),
		],
	},
];
