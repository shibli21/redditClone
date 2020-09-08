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
import { usePostsQuery, useDeletePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useState } from "react";
import UpdootSection from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [, deletePost] = useDeletePostMutation();
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!data && !fetching) {
    return <div>you got query failed for some reason</div>;
  }
  return (
    <Layout>
      {!data && fetching ? (
        <h1>Loading ..</h1>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={post} />
              <IconButton
                aria-label="delete"
                icon="delete"
                variantColor="red"
                onClick={() => deletePost({ id: post.id })}
              />
              <Flex align="center">
                <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                  <Link>
                    <Heading fontSize="xl">{post.title}</Heading>
                  </Link>
                </NextLink>
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
