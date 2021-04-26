/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useQuery, gql } from "@apollo/client";
import { IFriend } from "../interfaces/IFriend";
import EditFriend from "./EditFriend";
import DeleteFriend from "./DeleteFriend";

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
interface FriendData {
  getAllFriends: IFriend[];
}

export default function All() {
  const { loading, error, data, startPolling } = useQuery<FriendData>(
    ALL_FRIENDS,
    {
      fetchPolicy: "cache-and-network",
      pollInterval: 5 * 60 * 1000, //polInterval fetches data in given intervals
    }
  );

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.log("---->", error);
    console.log("--2->", error.graphQLErrors);
    console.log("--3->", error.graphQLErrors[0]);
    console.log("--4->", error.networkError);
    console.log("--5->", error.message);
    console.log("--6->", error.name);
    console.log("--7->", error.extraInfo);

    console.log("-##->", JSON.stringify(error.toString()));
  }
  if (error) return <p>{error.toString()}</p>;

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>firstName</th>
            <th>lastName</th>
            <th>email</th>
            <th>Role</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.getAllFriends.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.firstName}</td>
                <td>{f.lastName}</td>
                <td>{f.email}</td>
                <td>{f.role}</td>
                <td>
                  <br />
                  {<DeleteFriend email={f.email} />}
                  <br />
                  <EditFriend email={f.email} allowEdit={true} editMe={false} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
