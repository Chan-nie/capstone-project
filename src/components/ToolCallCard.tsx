"use client";

import React from "react";
import styles from "./ToolCallCard.module.css";
import { ToolCallState } from "@/hooks/useStreamingAnalysis";

export default function ToolCallCard({ toolCall }: { toolCall: ToolCallState }) {
  if (toolCall.status === "input-streaming") {
    return (
      <div className={`${styles.card} ${styles.streaming}`}>
        <div className={styles.header}>⚙️ Preparing tool: {toolCall.toolName}...</div>
      </div>
    );
  }

  if (toolCall.status === "input-available") {
    return (
      <div className={`${styles.card} ${styles.running}`}>
        <div className={styles.header}>⚙️ Running {toolCall.toolName}</div>
        <div className={styles.content}>
          Fetching metadata for: {toolCall.input?.url}
        </div>
      </div>
    );
  }

  if (toolCall.status === "output-error") {
    return (
      <div className={`${styles.card} ${styles.error}`}>
        <div className={`${styles.header} ${styles.headerError}`}>❌ Error in {toolCall.toolName}</div>
        <div className={styles.content}>{toolCall.error}</div>
      </div>
    );
  }

  if (toolCall.status === "output-available") {
    return (
      <div className={`${styles.card} ${styles.success}`}>
        <div className={styles.header}>✅ {toolCall.toolName} Success</div>
        <div className={styles.content}>
          <strong>Title:</strong> {toolCall.output?.title as string} <br />
          <strong>Description:</strong> {toolCall.output?.description as string}
        </div>
      </div>
    );
  }

  return null;
}