import { db } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import React from "react";

type Props = {};

const NotesPage = async (props: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: articles } = await supabase.from("articles").select();
  //const articles = await db.articles.findMany();

  return <pre>{JSON.stringify(articles, null, 2)}</pre>;
};

export default NotesPage;
