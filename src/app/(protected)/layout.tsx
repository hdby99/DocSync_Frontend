"use client";

import React, { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
