const sentencesRaw = `
{Monica} {would like to go}
{Monica} {would like to go} {with} {my family} {at night}
{Monica} {would like to go} {with} {you guys} {right now}
{someone} {goes to the party} {with} {you guys} {at night}
{i don't know why} {everyone} {goes to the party} {with} {you guys} {at night}
{someone} {goes to the party} {with} {my family}
{everyone} {is} {doing that} {right now} {at the restaurant}
{i don't know why} {Monica} {would like to go} {right now}
{everyone} {is} {doing that} {at the restaurant}
{everyone} {is} {watching a movie} {at my house}
{everyone} {is} {watching a movie} {right now} {at my house} {because i want it}
{Monica} {is} {watching a movie} {right now} {because I suggested it}
{someone} {is} {doing that} {close to home}
{my neighbor} {talks to me} {at the restaurant} {every day}
{my neighbor} {was} {close to home}
{my neighbor} {was} {with} {my family} {at the restaurant}
{Monica} {was} {with} {my family} {at the restaurant} {last night}
{someone} {talks to me} {every day}
{my cousin} {talks to me} {every day} {close to home}
{my cousin} {is} {doing that} {because I suggested it}
{my cousin} {is} {watching a movie} {because i want it}
{i don't know why} {every day} {Monica} {goes to the party}
{last night} {my cousin} {was} {at my house}
{every day} {my neighbor} {is} {close to home}
{is} {Monica} {with} {you guys}?
{was} {my cousin} {with} {you guys} {last night}?
{someone} {is} {doing that} {right now}
`

const sentences = sentencesRaw.split('\n').filter(line => !line.startsWith('#'))

const blocks = [
  ...new Set(
    sentences
      .join(' ')
      .toLowerCase()
      .match(/\{(.+?)\}/g)
      .map(v => '^' + v.replace(/[{}]/g, ''))
  ),
]

console.log(blocks)
