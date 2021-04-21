const unzipper = require('unzipper');
const fs = require('fs');
const R = require('ramda');
const camelcase = require('camelcase');
const nunjucks = require('nunjucks');
const { stdout, argv } = require('process');

const sketchColorToRgba = ({red, green, blue, alpha}) => `rgba(${(red * 255).toFixed()}, ${(green * 255).toFixed()}, ${(blue * 255).toFixed()}, ${alpha})`;

fs.createReadStream(argv[2])
    .pipe(unzipper.Parse())
    .on('entry', async entry => {
        if (entry.path === 'document.json') {
            const content = await entry.buffer();
            const doc = JSON.parse(content.toString('utf8'));

            stdout.write(
                nunjucks.render(
                    __dirname + '/designTokens.ts.njk',
                    {
                        colors: R.pipe(
                            R.filter(R.pipe(R.prop('name'), R.startsWith('UI/'))),
                            R.indexBy(R.pipe(R.prop('name'), R.split('/'), R.last, camelcase)),
                            R.map(R.pipe(R.prop('value'), sketchColorToRgba)),
                        )(doc.sharedSwatches.objects),

                        typography: R.pipe(
                            R.reduce(
                                (acc, current) => R.set(
                                    R.lensPath(R.map(camelcase)(R.split('/')(current.name))),
                                    R.applySpec({
                                        fontName: R.path(['MSAttributedStringFontAttribute', 'attributes', 'name']),
                                        fontSize: R.path(['MSAttributedStringFontAttribute', 'attributes', 'size']),
                                        color: R.pipe(R.prop('MSAttributedStringColorAttribute'), sketchColorToRgba),
                                    })(current.value.textStyle.encodedAttributes)
                                )(acc),
                                {}
                            ),
                        )(doc.layerTextStyles.objects),

                        layerStyles: R.pipe(
                          R.filter(R.pipe(R.prop('name'), R.startsWith('UI/'))),
                          R.indexBy(R.pipe(R.prop('name'), R.split('/'), R.last, camelcase)),
                          R.map(R.applySpec({
                            fillColor: R.pipe(R.path(["value", "fills", 0, "color"]), sketchColorToRgba),
                            borderColor: R.pipe(
                              R.path(["value", "borders", 0, "color"]),
                              R.unless(R.isNil, sketchColorToRgba),
                            ),
                          })),
                        )(doc.layerStyles.objects),
                    }
                )
            );
        } else {
            entry.autodrain();
        }
    })