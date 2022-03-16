import {
    useQuery,
    gql
} from "@apollo/client";

import React from "react"

const GET_GREETING = gql`
  query GetGreeting {
    hello
  }
`;

export const App = () =>{


    const { loading, error, data } = useQuery(GET_GREETING);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error :(</div>;

    return <div>{data.hello}</div>

}