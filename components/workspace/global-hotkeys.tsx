'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWorkspaceStore } from '@/lib/store';

export function GlobalHotkeys() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    toggleCodeEditor,
    toggleLeftSidebar,
    toggleRightInspector,
    toggleBottomDock,
    setActiveEnvironment,
    setIsTransitioningToHome,
  } = useWorkspaceStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is actively typing in text inputs, UNLESS it's Ctrl+D or Ctrl+L
      const isInput =
        e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      // 1. Ctrl + D -> Launch / Toggle MCU Code Editor Platform
      if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        toggleCodeEditor();
        return;
      }

      // 2. Ctrl + L -> Launch / Switch to Workspace
      if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        if (pathname !== '/workspace') {
          router.push('/workspace');
        } else {
          setActiveEnvironment('circuit_workspace');
        }
        return;
      }

      if (isInput) return;

      // 3. Ctrl + B -> Toggle Left Sidebar
      if (e.ctrlKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleLeftSidebar();
        return;
      }

      // 4. Ctrl + I -> Toggle Right Inspector Panel
      if (e.ctrlKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        toggleRightInspector();
        return;
      }

      // 5. Ctrl + J -> Toggle Bottom Instrument Dock
      if (e.ctrlKey && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        toggleBottomDock();
        return;
      }

      // 6. Ctrl + H -> Return to Portal / Homepage with smooth animation
      if (e.ctrlKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setIsTransitioningToHome(true);
        setTimeout(() => {
          router.push('/?from=workspace');
        }, 450);
        return;
      }

      // 7. Environment Quick Jumps: Ctrl + 1 to 6
      if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        setActiveEnvironment('component_explorer');
      } else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        setActiveEnvironment('electrical_sim_lab');
      } else if (e.ctrlKey && e.key === '3') {
        e.preventDefault();
        setActiveEnvironment('circuit_workspace');
      } else if (e.ctrlKey && e.key === '4') {
        e.preventDefault();
        setActiveEnvironment('device_explorer');
      } else if (e.ctrlKey && e.key === '5') {
        e.preventDefault();
        setActiveEnvironment('pcb_studio');
      } else if (e.ctrlKey && e.key === '6') {
        e.preventDefault();
        setActiveEnvironment('learning_academy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    router,
    pathname,
    toggleCodeEditor,
    toggleLeftSidebar,
    toggleRightInspector,
    toggleBottomDock,
    setActiveEnvironment,
  ]);

  return null;
}
