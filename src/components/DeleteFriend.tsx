import React from "react";
import { gql, useMutation } from "@apollo/client";

const DELETE_FRIEND = gql`
  mutation deleteFriend($input: String) {
    deleteFriend(input: $input)
  }
`;

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

type deleteFriendProps = {
  email: string;
};

const DeleteF = ({ email }: deleteFriendProps) => {
  function filterByemail(f: any) {
    if (f.email) return f.email !== email;
  }
  const [deleteFriend, { data, loading, error }] = useMutation(DELETE_FRIEND, {
    update(cache, { data }) {
      const deleted = data.deleteFriend;
      console.log("DELETED?????", deleted);
      if (deleted) {
        const d: any = cache.readQuery({ query: ALL_FRIENDS });
        let allFriends = d.getAllFriends || [];
        let a = Array.from(allFriends);
        let b = a.filter(filterByemail);
        cache.writeQuery({
          query: ALL_FRIENDS,
          data: { getAllFriends: [...b] },
        });
      }
    },
  });
  if (error) {
    console.log(error);
  }
  //   if (data) {
  //     console.log(data);
  //   }
  //   if (loading) {
  //     console.log("loading");
  //   }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    deleteFriend({
      variables: { input: email },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="submit" value="DELETE" />
      </form>
    </div>
  );
};

export default DeleteF;

// const deleteF = ({ email }: deleteFriendProps) => {
//   return (
//     <div>
//       //{" "}
//       <form
//         onSubmit={() => {
//           console.log(email);
//         }}
//       >
//         // <input type="submit" value="Submit" />
//         //{" "}
//       </form>
//       //{" "}
//     </div>
//   );
// };

// export default deleteF;
