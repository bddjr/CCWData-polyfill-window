//@ts-nocheck

import fs from 'fs'
import { minify_sync } from "terser";
import { rimrafSync } from 'rimraf'
import JSZip from 'jszip'
import path from 'path'

rimrafSync('dist')
fs.mkdirSync('dist')

const src = fs.readFileSync("src/KEY.js").toString()

const result = minify_sync(src, {
    format: {
        wrap_iife: false,
        quote_style: 1,
    },
})

const code = ''.concat(
    '/*<https://github.com/bddjr/CCWData-polyfill-window>*/toString.constructor`',
    result.code
        .replace(/;?\s*$/, '')
        .replaceAll(/[()= \n\\`]|\$\{/g, (m) => {
            switch (m) {
                case '\\':
                case '`':
                case '${':
                    return '\\' + m
                case '\n':
                    return '\\n'
            }
            return '\\x' + m.charCodeAt(0).toString(16).padStart(2, '0')
        })
    ,
    '```'
)

fs.writeFileSync('dist/KEY.js', code)

if (fs.existsSync('templates')) {
    const datename = (d => ''.concat(
        d.getUTCFullYear(),
        (d.getUTCMonth() + 1).toString().padStart(2, '0'),
        d.getUTCDate().toString().padStart(2, '0'),
        '-',
        d.getUTCHours().toString().padStart(2, '0'),
        d.getUTCMinutes().toString().padStart(2, '0'),
        d.getUTCSeconds().toString().padStart(2, '0'),
    ))(new Date(Date.now() + 28800000))

    const out_stringify = JSON.stringify(code)

    for (const name of fs.readdirSync('templates')) {
        let jsonFileName = ''
        const extname = path.extname(name)
        switch (extname) {
            case '.sprite3':
                jsonFileName = 'sprite.json'
                break
            case '.sb3':
                jsonFileName = 'project.json'
                break
            default:
                continue
        }

        const jz = await JSZip.loadAsync(fs.readFileSync("templates/" + name))

        let sprite_rawjson = await jz.file(jsonFileName).async("string")

        sprite_rawjson = sprite_rawjson.replaceAll('"{{CCWData-polyfill-window}}"', out_stringify)

        jz.file(jsonFileName, sprite_rawjson)

        const jz_out = await jz.generateAsync({
            compression: 'DEFLATE',
            type: 'nodebuffer'
        })

        const outname = (a => (a.splice(-1, 0, datename), a.join('.')))(name.split('.'))

        fs.writeFileSync("dist/" + outname, jz_out)
    }
}
