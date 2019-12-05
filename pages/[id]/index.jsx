import React from 'react'
import { useRouter } from 'next/router'
import { Col, Row, Spin } from 'antd'
import styled from 'styled-components'
import Head from 'next/head'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'
import Link from 'next/link'
import validate from 'uuid-validate'
import Page from '../../layouts/Page'
import Container from '../../components/Container'
import Product from '../../components/Product'
import PorductSider from '../../components/ProductSider'
import Comments from '../../components/Comments'
import { GET_PRODUCT } from '../../queries'
import SmallTitle from '../../components/SmallTitle'
import withApollo from '../../libs/with-apollo'
import Milestones from '../../components/Milestones'
import Wishes from '../../components/Wishes'

const StyledContainer = styled(Container)`
  margin-top: 24px;
  margin-bottom: 24px;
`

const ProductPage = () => {
  const { query: { id } } = useRouter()
  const { loading, data } = useQuery(GET_PRODUCT, { variables: { id } })
  const product = get(data, 'product', {})
  const keywords = (product.topics || []).map(x => x.name).join(',')
  const description = (product.description || '').slice(0, 120) + '...'
  return (
    <Page>
      <Head>
        <title>{product.name} - {process.env.NAME}</title>
        <meta key='description' name='description' content={description} />
        <meta key='keywords' name='keywords' content={keywords} />
      </Head>
      <StyledContainer>
        <Row type='flex' gutter={24}>
          <Col xl={12} lg={15} md={14} sm={24} xs={24}>
            <Spin spinning={loading}>
              <Product {...product} full />
            </Spin>
          </Col>
          <Col xl={6} lg={9} md={10} sm={24} xs={24}>
            <PorductSider {...product} />
          </Col>
        </Row>
        <Row type='flex' gutter={24}>
          <Col xl={12} lg={15} md={14} sm={24} xs={24}>
            <SmallTitle id='milestones' name='milestones'>
              <Link href='/[id]/milestones' as={`/${id}/milestones`}>
                <a>
              里程碑
                </a>
              </Link>
            </SmallTitle>
            <Milestones productId={id} product={product} />
            <SmallTitle id='wishes' name='wishes'>新愿</SmallTitle>
            <Wishes productId={id} product={product} />
            <SmallTitle id='comments' name='comments'>聊一聊</SmallTitle>
            <Comments productId={id} product={product} />
          </Col>
        </Row>
      </StyledContainer>
    </Page>
  )
}

ProductPage.getInitialProps = ({ query: { id }, res }) => {
  if (res) {
    res.statusCode = 404
  }
  if (!validate(id)) return { statusCode: 404 }
}

export default withApollo(ProductPage)
