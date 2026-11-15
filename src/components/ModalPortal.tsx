import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Global Modal & Popup Stack Manager
 * Guarantees that nested popups/modals always render above the popup that triggered them,
 * escaping any parent CSS stacking contexts (transform, backdrop-filter, z-index, overflow)
 * and dynamically assigning strictly increasing z-index layers in chronological order.
 */

const BASE_MODAL_Z_INDEX = 10000;
const MODAL_Z_STEP = 20;

interface StackEntry {
  id: string;
  order: number;
  priorityOffset: number;
}

let sequenceCounter = 0;
const activeStack: StackEntry[] = [];
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function registerModalInStack(id: string, priorityOffset: number = 0, notify: boolean = false): number {
  const existingIndex = activeStack.findIndex((entry) => entry.id === id);
  if (existingIndex !== -1) {
    activeStack[existingIndex].priorityOffset = priorityOffset;
    return getModalZIndex(id);
  }
  sequenceCounter += 1;
  activeStack.push({
    id,
    order: sequenceCounter,
    priorityOffset,
  });
  if (notify) {
    notifyListeners();
  }
  return getModalZIndex(id);
}

export function bringModalToFront(id: string, priorityOffset: number = 0): number {
  const existingIndex = activeStack.findIndex((entry) => entry.id === id);
  sequenceCounter += 1;
  if (existingIndex !== -1) {
    const [entry] = activeStack.splice(existingIndex, 1);
    entry.order = sequenceCounter;
    entry.priorityOffset = priorityOffset;
    activeStack.push(entry);
  } else {
    activeStack.push({
      id,
      order: sequenceCounter,
      priorityOffset,
    });
  }
  notifyListeners();
  return getModalZIndex(id);
}

export function unregisterModalFromStack(id: string): void {
  const existingIndex = activeStack.findIndex((entry) => entry.id === id);
  if (existingIndex !== -1) {
    activeStack.splice(existingIndex, 1);
    if (activeStack.length === 0) {
      sequenceCounter = 0;
    }
    notifyListeners();
  }
}

export function getModalZIndex(id: string): number {
  const index = activeStack.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return BASE_MODAL_Z_INDEX + (sequenceCounter + 1) * MODAL_Z_STEP;
  }
  const entry = activeStack[index];
  return BASE_MODAL_Z_INDEX + entry.order * MODAL_Z_STEP + entry.priorityOffset;
}

export function getModalStackPosition(id: string): number {
  const index = activeStack.findIndex((entry) => entry.id === id);
  return index === -1 ? activeStack.length + 1 : index + 1;
}

export interface ModalPortalProps {
  children: React.ReactNode;
  /** Optional explicit open flag. When false, unregisters from stack and renders nothing. */
  isOpen?: boolean;
  /** Optional key that, when changed while open, promotes this modal to the top of the stack. */
  triggerKey?: unknown;
  /** Optional priority offset (e.g. for critical system alarms). */
  priorityOffset?: number;
}

export const ModalPortal: React.FC<ModalPortalProps> = ({
  children,
  isOpen = true,
  triggerKey,
  priorityOffset = 0,
}) => {
  const reactId = useId();
  const modalId = `modal_${reactId}`;
  const [, forceUpdate] = useState(0);
  const isRegisteredRef = useRef(false);
  const prevTriggerKeyRef = useRef(triggerKey);

  const hasContent = isOpen && children !== null && children !== undefined && children !== false;

  // Register synchronously on first active render (without notifying other components during render)
  // so the initial paint frame already has the exact top-of-stack zIndex.
  if (hasContent && !isRegisteredRef.current && typeof document !== 'undefined') {
    isRegisteredRef.current = true;
    registerModalInStack(modalId, priorityOffset, false);
  }

  useLayoutEffect(() => {
    if (!hasContent) {
      if (isRegisteredRef.current) {
        isRegisteredRef.current = false;
        unregisterModalFromStack(modalId);
      }
      return;
    }

    const handleStackChange = () => {
      forceUpdate((v) => v + 1);
    };
    listeners.add(handleStackChange);

    if (!isRegisteredRef.current) {
      isRegisteredRef.current = true;
      registerModalInStack(modalId, priorityOffset, true);
      forceUpdate((v) => v + 1);
    } else if (prevTriggerKeyRef.current !== triggerKey) {
      prevTriggerKeyRef.current = triggerKey;
      bringModalToFront(modalId, priorityOffset);
    }

    return () => {
      listeners.delete(handleStackChange);
    };
  }, [hasContent, modalId, priorityOffset, triggerKey]);

  useEffect(() => {
    return () => {
      if (isRegisteredRef.current) {
        isRegisteredRef.current = false;
        unregisterModalFromStack(modalId);
      }
    };
  }, [modalId]);

  if (!hasContent || typeof document === 'undefined') {
    return null;
  }

  const zIndex = getModalZIndex(modalId);
  const stackPos = getModalStackPosition(modalId);

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none [&>*]:pointer-events-auto"
      style={{ zIndex }}
      data-modal-portal={modalId}
      data-modal-stack-level={stackPos}
    >
      {children}
    </div>,
    document.body
  );
};

export default ModalPortal;
