import { readFileSync } from 'fs'
import { resolve } from 'path'
import get from 'lodash/get'
import Handlebars from 'handlebars'
import initApollo from '../../../libs/init-apollo'
import ProductDetail from '../../../queries/ProductDetail.gql'

const template = Handlebars.compile(readFileSync(resolve('./templates/card.svg.hbs'), { encoding: 'utf8' }))

export default async (req, res) => {
  const apollo = initApollo()
  res.setHeader('Content-Type', 'image/svg+xml')
  res.statusCode = 200
  const { id } = req.query
  const data = await apollo.query({
    query: ProductDetail,
    variables: {
      id
    }
  })
  const product = get(data, 'data.product')
  if (!product) return res.statusCode(404).end()
  const { icon, medias } = product
  res.send(template({
    name: process.env.NEXT_PUBLIC_NAME,
    wxacode: `${process.env.NEXT_PUBLIC_API}/products/${product.id}/wxacode`,
    icon: icon ? `${process.env.NEXT_PUBLIC_FILES}/${icon.hash}-160-160-contain` : '',
    media: medias.length ? `${process.env.NEXT_PUBLIC_FILES}/${medias[0].hash}` : '',
    product
  }))
}
