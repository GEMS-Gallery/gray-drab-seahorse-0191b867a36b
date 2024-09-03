import Func "mo:base/Func";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts: [Post] = [];
  stable var nextId: Nat = 0;

  // Function to get all posts
  public query func getPosts() : async [Post] {
    Array.reverse(posts)
  };

  // Function to create a new post
  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let id = nextId;
    nextId += 1;

    let newPost: Post = {
      id;
      title;
      body;
      author;
      timestamp = Time.now();
    };

    posts := Array.append(posts, [newPost]);
    Debug.print("New post created with ID: " # debug_show(id));
    id
  };
}
