import React from 'react'
import Head from 'next/head'
import { Col, Row, Spin, Typography } from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import get from 'lodash/get'
import Link from 'next/link'
import Page from '../../../layouts/Page'
import Container from '../../../components/Container'
import RightSide from '../../../components/RightSide'
import media from '../../../libs/media'
import withApollo from '../../../libs/with-apollo'
import Box from '../../../components/Box'
import UserFollowers from '../../../queries/UserFollowers.gql'
import usePagination from '../../../hooks/usePagination'
import UserCell from '../../../components/UserCell'

const StyledContainer = styled(Container)`
margin: 24px auto;
`

const LikeContent = styled.div`
padding: 0 24px;
margin-bottom: 24px;
${media.sm`
  padding: 0;
`}
`

const Content = styled(Box)`
padding: 24px;
display: flex;
align-items: center;
flex-direction: column;
margin-bottom: 24px;
`

export default withApollo(() => {
  const { query: { id } } = useRouter()
  const {
    result: {
      loading,
      data
    },
    pagination
  } = usePagination({
    path: '/users/[id]/followers',
    query: UserFollowers,
    getTotal: ({ data }) => get(data, 'user.followers.total', 0),
    getLink: (path, queryString) => ({
      href: `${path}/followers${queryString}`,
      as: `/users/${id}/followers${queryString}`
    }),
    getQuery: ({ id, ...rest }) => rest,
    options: {
      variables: {
        id
      }
    }
  })
  const user = get(data, 'user', {})
  const list = get(user, 'followers.data', [])
  return (
    <Page>
      <Head>
        <title>{user.nickname}的粉丝 - {process.env.NAME}</title>
      </Head>
      <StyledContainer>
        <Row gutter={24}>
          <Col lg={18} md={17} xs={24}>
            <LikeContent>
              <Typography.Title level={4}>粉丝</Typography.Title>
              关注 <Link href={`/users/${user.id}`}><a>{user.nickname}</a></Link> 的用户
            </LikeContent>
            <Content>
              <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                  {list.map(x => (
                    <Col key={x.id} span={12}>
                      <UserCell user={x} showDescription showFollow />
                    </Col>
                  ))}
                </Row>
              </Spin>
              {pagination}
            </Content>
          </Col>
          <Col lg={6} md={7} xs={24}>
            <RightSide />
          </Col>
        </Row>
      </StyledContainer>
    </Page>
  )
})
