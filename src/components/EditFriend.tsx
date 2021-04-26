/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { IFriend } from "../interfaces/IFriend";
import { gql, useMutation } from "@apollo/client";

const editMeMutation = `mutation editMe($friend: FriendEditInput) {
    editMe(input: $friend) {
      id
      email
      firstName
      lastName
      role
    }
  }`;

const editFriendMutation = `mutation editFriend($friend: FriendEditInput) {
    editFriend(input: $friend) {
      id
      email
      firstName
      lastName
      role
    }
  }`;

const ALL_FRIENDS = gql`
  {
    getAllFriends {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

type IEditedFriend = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};
type EditFriendProps = {
  initialFriend?: IEditedFriend;
  allowEdit: true;
  editMe: boolean;
  email: string | null;
};
interface IKeyableFriend extends IEditedFriend {
  [key: string]: any;
}

const EditFriend = ({
  email,
  initialFriend,
  allowEdit,
  editMe,
}: EditFriendProps) => {
  const EMPTY_FRIEND: IEditedFriend = {};
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND };

  let EDIT_FRIEND;
  editMe
    ? (EDIT_FRIEND = gql`
        ${editMeMutation}
      `)
    : (EDIT_FRIEND = gql`
        ${editFriendMutation}
      `);

  const [MSG, setMSG] = useState("Start Typing");

  const [editFriend, { data, loading, error }] = useMutation(EDIT_FRIEND, {
    update(cache, { data }) {
      if (!editMe) {
        const editedFriend = data.editFriend;
        const d: any = cache.readQuery({ query: ALL_FRIENDS });
        let allFriends = d.getAllFriends || [];
        // let x = allFriends.GET_FRIEND(email)
        // allFriends[x]=editedFriend
        cache.writeQuery({
          query: ALL_FRIENDS,
          data: { getAllFriends: [...allFriends, editFriend] },
          //it adds one extra friend insted of editig one
        });
      } /*



      */
    },
  });
  //   if (loading) {
  //     setMSG("Loading...");
  //   } else setMSG(data);
  //   if (error) {
  //     setMSG(error.message);
  //   }

  const [friend, setFriend] = useState({ ...newFriend });
  const [readOnly, setReadOnly] = useState(!allowEdit);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMSG("");
    const id = event.currentTarget.id;
    var friendToChange: IKeyableFriend = { ...friend };
    friendToChange[id] = event.currentTarget.value;
    setFriend({ ...friendToChange });
  };
  const handleSubmit = (event: React.FormEvent) => {
    console.log(friend);

    if (!friend.firstName && !friend.lastName && !friend.password) {
      setMSG("nothing to change");
    } else {
      event.preventDefault();
      editFriend({
        variables: {
          friend: { ...friend, email: email },
        },
      });
      setFriend({ ...EMPTY_FRIEND });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/*editMe ? (
        ""
      ) : (
        <label>
          Email <br />
          <input
            readOnly={readOnly}
            type="email"
            id="email"
            value={friend.email}
            onChange={handleChange}
          />
        </label>
      )*/}
      <label>
        FirstName
        <br />
        <input
          type="text"
          readOnly={readOnly}
          id="firstName"
          value={friend.firstName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        LastName <br />
        <input
          readOnly={readOnly}
          type="text"
          id="lastName"
          value={friend.lastName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password <br />
        <input
          readOnly={readOnly}
          type="password"
          id="password"
          value={friend.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />
      {!readOnly && <input type="submit" value="Save changes" />}{" "}
      {loading ? "Loading" : MSG}
      <p>{data && JSON.stringify(data)}</p>
    </form>
  );
};

export default EditFriend;
