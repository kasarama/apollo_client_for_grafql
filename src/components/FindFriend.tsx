/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { IFriend } from "../interfaces/IFriend";

interface IFriendResult {
  getFriend: IFriend;
}

interface IVariableInput {
  email: string;
}

const GET_FRIEND = gql`
  query getFriend($email: String) {
    getFriend(email: $email) {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

export default function FindFriend() {
  const [email, setEmail] = useState("");
  const [getFriend, { loading, called, data }] = useLazyQuery<
    IFriendResult,
    IVariableInput
  >(GET_FRIEND, {});

  const fetchFriend = () => {
    getFriend({ variables: { email } });
  };

  return (
    <div>
      <h2>Fetch a friend using the provided email</h2>
      email:{" "}
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      &nbsp; <button onClick={fetchFriend}>Find Friend</button>
      <br />
      <br />
      {called && loading && <div className="loader"></div>}
      {data && (
        <div>
          <p>{data.getFriend.firstName}</p>
          <p>{data.getFriend.lastName}</p>
        </div>
      )}
    </div>
  );
}
