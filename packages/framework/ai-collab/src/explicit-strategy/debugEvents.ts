/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { v4 as uuidv4 } from "uuid";

import type { DebugEvent, EventFlowDebugEvent } from "../aiCollabApi.js";

/**
 * This file contains the types for the debug events that are emitted by the explicit strategy
 * as well as a helper functions to help create a consistent method for producing a base {@link DebugEvent}.
 */

/**
 * The possible values for the `eventFlowName` field in an {@link EventFlowDebugEvent}.
 * @alpha
 */
export const EventFlowDebugNames = {
	CORE_EVENT_LOOP: "CORE_EVENT_LOOP",
	GENERATE_PLANNING_PROMPT: "GENERATE_PLANNING_PROMPT",
	GENERATE_AND_APPLY_TREE_EDIT: "GENERATE_AND_APPLY_TREE_EDIT",
	FINAL_REVIEW: "FINAL_REVIEW",
} as const;

/**
 * The type for possible values for the `eventFlowName` field in an {@link EventFlowDebugEvent}.
 * @alpha
 */
export type EventFlowDebugName =
	(typeof EventFlowDebugNames)[keyof typeof EventFlowDebugNames];

/**
 * An edit generated by an LLM that can be applied to a given SharedTree.
 * @privateremarks TODO: We need a better solution here because don't want to expose the internal TreeEdit type here, but we need to be able to type it.
 * @alpha
 */
export type LlmTreeEdit = Record<string, unknown>;

/**
 * An {@link EventFlowDebugEvent} for signaling the start of the ai-collab's core event loop.
 * Which makes various calls to the LLM to eventually apply edits to the users SharedTree which
 * accomplish the user's provided goal. There will be exactly 1 of these events per ai-collab function execution.
 * @alpha
 */
export interface CoreEventLoopStarted extends EventFlowDebugEvent {
	eventName: "CORE_EVENT_LOOP_STARTED";
	eventFlowName: typeof EventFlowDebugNames.CORE_EVENT_LOOP;
	eventFlowStatus: "STARTED";
}

/**
 * An {@link EventFlowDebugEvent} for signaling the end of the ai-collab's core event loop.
 * There could be various reasons for the event loop to end, early exits and failures
 * which should be captured in the status and failureReason fields. There will be exactly 1
 * of these events per ai-collab function execution.
 * @alpha
 */
export interface CoreEventLoopCompleted extends EventFlowDebugEvent {
	eventName: "CORE_EVENT_LOOP_COMPLETED";
	eventFlowName: typeof EventFlowDebugNames.CORE_EVENT_LOOP;
	eventFlowStatus: "COMPLETED";
	status: "success" | "failure";
	failureReason?: string;
	errorMessage?: string;
}

// #region Planning Prompt Debug events -------------------------------

/**
 * An {@link EventFlowDebugEvent} marking the initiation of the flow for prompting an LLM to generate a plan for accomplishing the user's goal.
 * There will be exactly 1 of these events per ai-collab function execution.
 * @alpha
 */
export interface PlanningPromptStarted extends EventFlowDebugEvent {
	eventName: "GENERATE_PLANNING_PROMPT_STARTED";
	eventFlowName: typeof EventFlowDebugNames.GENERATE_PLANNING_PROMPT;
	eventFlowStatus: "STARTED";
}

/**
 * An {@link EventFlowDebugEvent} marking the completion of the flow for prompting an LLM to generate a plan for accomplishing the user's goal.
 * There will be exactly 1 of these events per ai-collab function execution.
 * @alpha
 */
export interface PlanningPromptCompleted<
	TIsLlmResponseValid = boolean,
	TPlan = TIsLlmResponseValid extends true ? string : undefined,
> extends EventFlowDebugEvent {
	eventName: "GENERATE_PLANNING_PROMPT_COMPLETED";
	eventFlowName: typeof EventFlowDebugNames.GENERATE_PLANNING_PROMPT;
	eventFlowStatus: "COMPLETED";
	/**
	 * Whether the response produced by the LLM is an expected response.
	 * In the event that the LLM fails to respond in an expected way, despite the API call to the LLM itself being successful, then this fields value will be `false`.
	 *
	 * For now, this case is limited to the LLM returning undefined as a response when it should have returned something. But in the future this could expand
	 * to things such as invalid json.
	 */
	isLlmResponseValid: TIsLlmResponseValid;
	/**
	 * The plan generated by the LLM. If the `wasLlmResponseValid` field is `false` then this will be undefined, otherwise it will be a string.
	 */
	llmGeneratedPlan: TPlan;
}

// #endregion Planning Prompt Debug events ----------------------------------------------------------

// #region Generate And Apply Tree Edit Debug events ------------------

/**
 * An {@link EventFlowDebugEvent} marking the initiation of the flow for prompting an LLM to
 * generate an {@link LlmTreeEdit} to the users Shared Tree based on the users initial ask.
 * It is expected that the LLM will generate multiple of these events when it must generate multiple tree edits to satisfy the user request
 * @alpha
 */
export interface GenerateTreeEditStarted extends EventFlowDebugEvent {
	eventName: "GENERATE_TREE_EDIT_STARTED";
	eventFlowName: typeof EventFlowDebugNames.GENERATE_AND_APPLY_TREE_EDIT;
	eventFlowStatus: "STARTED";
	llmPrompt: string;
}

/**
 * An {@link EventFlowDebugEvent} marking the completion of the flow for prompting an LLM to
 * generate an {@link LlmTreeEdit} to the users Shared Tree based on the users initial ask.
 * It is expected that the LLM will generate multiple of these events when it must generate multiple tree edits to satisfy the user request
 * @alpha
 */
export interface GenerateTreeEditCompleted<
	TIsLlmResponseValid = boolean,
	TEdit = TIsLlmResponseValid extends true ? LlmTreeEdit | null : undefined,
> extends EventFlowDebugEvent {
	eventName: "GENERATE_TREE_EDIT_COMPLETED";
	eventFlowName: typeof EventFlowDebugNames.GENERATE_AND_APPLY_TREE_EDIT;
	eventFlowStatus: "COMPLETED";
	/**
	 * Whether the response produced by the LLM is an expected response.
	 * In the event that the LLM fails to respond in an expected way, despite the API call to the LLM itself being successful, then this fields value will be `false`.
	 *
	 * For now, this case is limited to the LLM returning undefined as a response when it should have returned something. But in the future this could expand
	 * to things such as invalid json.
	 */
	isLlmResponseValid: TIsLlmResponseValid;
	/**
	 * If the `isLlmResponseValid` field value is `true` then this be one of two following values returned by the LLM:
	 * 1. An edit that can be applied to a SharedTree to further accomplish the user's goal.
	 * 2. `null` if the LLM decides no more edits are necessary.
	 *
	 * If the `isLlmResponseValid` field is `false` then this field will be `undefined`.
	 */
	llmGeneratedEdit: TEdit;
}

/**
 * An {@link EventFlowDebugEvent} marking the successful application of an edit generated by the LLM to a SharedTree.
 * @alpha
 */
export interface ApplyEditSuccess extends EventFlowDebugEvent {
	eventName: "APPLIED_EDIT_SUCCESS";
	eventFlowName: typeof EventFlowDebugNames.GENERATE_AND_APPLY_TREE_EDIT;
	eventFlowStatus: "IN_PROGRESS";
	/**
	 * A unique id that will be shared across all debug events that are part of the same event flow.
	 */
	eventFlowTraceId: string;
	/**
	 * The {@link LlmTreeEdit} generated by the LLM.
	 */
	edit: LlmTreeEdit;
}

/**
 * An {@link EventFlowDebugEvent} marking the failure of applying an edit generated by the LLM to a SharedTree.
 * @alpha
 */
export interface ApplyEditFailure extends EventFlowDebugEvent {
	eventName: "APPLIED_EDIT_FAILURE";
	eventFlowName: typeof EventFlowDebugNames.GENERATE_AND_APPLY_TREE_EDIT;
	eventFlowStatus: "IN_PROGRESS";
	/**
	 * A unique id that will be shared across all debug events that are part of the same event flow.
	 */
	eventFlowTraceId: string;
	/**
	 * The {@link LlmTreeEdit} generated by the LLM.
	 */
	edit: LlmTreeEdit;
	/**
	 * The error message that was thrown when attempting to apply the edit.
	 */
	errorMessage: string;
	/**
	 * The total number of errors that have occurred up until this point, not including this error.
	 */
	sequentialErrorCount: number;
}

// #endregion Generate And Apply Tree Edit Debug events ----------------------

// #region Generate Final Review Debug events -------------------------

/**
 * An {@link EventFlowDebugEvent} marking the initiation of the flow for prompting an LLM to complete a final review of its edits
 * and determine whether the user's goal was accomplished.
 * @alpha
 */
export interface FinalReviewStarted extends EventFlowDebugEvent {
	eventName: "FINAL_REVIEW_STARTED";
	eventFlowName: typeof EventFlowDebugNames.FINAL_REVIEW;
	eventFlowStatus: "STARTED";
	/**
	 * The prompt sent to the LLM to complete its final review of the edits its made.
	 */
	llmPrompt: string;
}

/**
 * An {@link EventFlowDebugEvent} marking the end of the flow for prompting an LLM to complete a final review of its edits
 * and determine whether the user's goal was accomplished.
 * @alpha
 */
export interface FinalReviewCompleted<
	TIsLlmResponseValid = boolean,
	TReviewResponse = TIsLlmResponseValid extends true ? "yes" | "no" : undefined,
> extends EventFlowDebugEvent {
	eventName: "FINAL_REVIEW_COMPLETED";
	eventFlowName: typeof EventFlowDebugNames.FINAL_REVIEW;
	eventFlowStatus: "COMPLETED";
	/**
	 * Whether the response produced by the LLM is an expected response.
	 * In the event that the LLM fails to respond in an expected way, despite the API call to the LLM itself being successful, then this fields value will be `false`.
	 *
	 * For now, this case is limited to the LLM returning undefined as a response when it should have returned something. But in the future this could expand
	 * to things such as invalid json.
	 */
	isLlmResponseValid: TIsLlmResponseValid;
	/**
	 * Whether the Llm believes the user's ask was accomplished, based on the Edits is has already generated and applied.
	 * If the `status` field is `false` then this field value will be `undefined`, otherwise it will be either "yes" or "no"
	 */
	didLlmAccomplishGoal: TReviewResponse;
}

// #endregion Generate Final Review Debug events ----------------------

/**
 * An {@link DebugEvent} for an API call directly to a LLM.
 * @alpha
 */
export interface LlmApiCallDebugEvent extends DebugEvent {
	eventName: "LLM_API_CALL";
	/**
	 * The event flow name that made this LLM API call.
	 */
	triggeringEventFlowName: EventFlowDebugName;
	/**
	 * The unique id that will be shared across all debug events that are part of the same event flow.
	 * @remarks This can be used to correlate all debug events that are part of the same event flow.
	 */
	eventFlowTraceId: string;
	/**
	 * The LLM model name that was used for the API call.
	 */
	modelName: string;
	/**
	 * The request parameters sent in the API call to the LLM. (Not the HTTP request parameters such as headers, etc.)
	 */
	requestParams: unknown;
	/**
	 * The raw response from the LLM.
	 */
	response: unknown;
	/**
	 * The total number of tokens used in the API call to the LLM.
	 */
	tokenUsage?: {
		promptTokens: number;
		completionTokens: number;
	};
}

/**
 * Creates a base {@link DebugEvent}.
 */
export function generateDebugEvent<Tevent extends string>(
	eventName: Tevent,
	traceId: string,
): DebugEvent & { eventName: Tevent } {
	const event = {
		eventName,
		id: uuidv4(),
		traceId,
		timestamp: new Date().toISOString(),
	};
	return event;
}
