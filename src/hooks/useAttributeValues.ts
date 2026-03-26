"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { TypedDocumentString } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/api";

type AttributeValueNode = {
	slug: string | null;
	name: string | null;
	/** CSS color value — only set for swatch-type attributes */
	value: string | null;
};

type AttributeNode = {
	slug: string | null;
	name: string | null;
	choices: {
		edges: Array<{ node: AttributeValueNode }>;
	} | null;
};

type AttributeValuesResult = {
	attributes: {
		edges: Array<{ node: AttributeNode }>;
	} | null;
};

type AttributeValuesVariables = {
	channel: string;
	slugs: string[];
};

const AttributeValuesDocument = new TypedDocumentString<AttributeValuesResult, AttributeValuesVariables>(`
  query AttributeValues($channel: String!, $slugs: [String!]!) {
    attributes(
      first: 50
      channel: $channel
      filter: { slugs: $slugs }
    ) {
      edges {
        node {
          slug
          name
          choices(first: 100) {
            edges {
              node {
                slug
                name
                value
              }
            }
          }
        }
      }
    }
  }
`);

const useAttributeValues = (slugs: string[], channelOverride?: string) => {
	const params = useParams();
	const channel = channelOverride ?? ((params?.channel) as string | undefined) ?? "default-channel";

	const { data, isLoading, error } = useSWR(
		["attribute-values", channel, ...slugs],
		() => executeGraphQL(AttributeValuesDocument, { variables: { channel, slugs }, withAuth: false })
	);

	const getChoices = (slug: string): AttributeValueNode[] =>
		data?.attributes?.edges.find((e) => e.node.slug === slug)?.node.choices?.edges.map((e) => e.node) ??
		[];

	return { data, isLoading, error, getChoices };
};

export { useAttributeValues, type AttributeValueNode, type AttributeNode };
