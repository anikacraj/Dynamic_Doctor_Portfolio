"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
  const [user, setUser] = useState(null);
  const params = useParams();
  const userId = params.userId;

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log("error fetching users:", err));
  }, [userId]);

  return <div>{JSON.stringify(user)}</div>;
}

