'use client';

import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store';

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useWorkspaceStore();

  return (
    <div className="relative">
      {/* Bell Button with Red Dot */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-md text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {/* Pulsing Red Dot when unread > 0 */}
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
        )}
      </button>

      {/* Flyout Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f1319] border border-[#30363D] p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-mono">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#21262D]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F0F6FC]">Engineering Alerts</span>
              {unreadNotificationsCount > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {unreadNotificationsCount} NEW
                </span>
              ) : (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  All Read
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-[#58A6FF] hover:underline flex items-center gap-1 font-semibold"
                  title="Mark all as read to clear the red dot"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark as read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded text-[#8B949E] hover:text-[#F0F6FC]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#8B949E]">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    notif.read
                      ? 'bg-[#161B22]/40 border-transparent opacity-75'
                      : 'bg-[#161B22] border-[#30363D] shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {notif.type === 'success' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : notif.type === 'warning' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-[#58A6FF] shrink-0 mt-0.5" />
                      )}
                      <h5 className="text-xs font-bold text-[#F0F6FC]">{notif.title}</h5>
                    </div>
                    <span className="text-[10px] text-[#8B949E] shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#8B949E] mt-1 pl-5 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
