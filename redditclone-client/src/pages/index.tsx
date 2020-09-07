import {
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useState } from "react";
import UpdootSection from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!data && !fetching) {
    return <div>you got query failed for some reason</div>;
  }
  return (
    <Layout>
      <Flex alignItems="center">
        <Heading color="teal">S REDIT</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>

      <br />
      {!data && fetching ? (
        <h1>Loading ..</h1>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={post} />
              <Flex align="center">
                <Heading fontSize="xl">{post.title}</Heading>
                <Heading ml="auto" fontSize="s" fontWeight="medium">
                  {post.creator.username}
                </Heading>
              </Flex>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            m="auto"
            my={4}
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
