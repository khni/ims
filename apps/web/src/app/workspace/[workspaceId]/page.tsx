"use client";
import { useCommonTranslations } from "@/messages/common";
import React from "react";

export default function Page({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { statusTranslations } = useCommonTranslations();
  const { workspaceId } = React.use(params);
  //here I will fetch organization by id
  return <div>{statusTranslations("success")}</div>;
}
