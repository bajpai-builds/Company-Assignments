"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface User {
  id: string;
  name: string;
  avatar: string;
  lastSeen: Date;
}

const INITIAL_USERS = [
  { id: '1', name: 'Alice Smith', avatar: 'AS', lastSeen: new Date() },
  { id: '2', name: 'Bob Johnson', avatar: 'BJ', lastSeen: new Date() },
  { id: '3', name: 'Charlie Brown', avatar: 'CB', lastSeen: new Date() }
];

const getRandomIndex = (length: number): number => Math.floor(Math.random() * length);

const getAvailableUsers = (allUsers: User[], currentUsers: User[]): User[] => {
  const currentIds = new Set(currentUsers.map(u => u.id));
  return allUsers.filter(user => !currentIds.has(user.id));
};

const removeRandomUser = (users: User[]): User[] => {
  const index = getRandomIndex(users.length);
  return users.filter((_, i) => i !== index);
};

export function Presence() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    setActiveUsers(INITIAL_USERS);

    const updateUsers = () => {
      if (Math.random() <= 0.7) return;

      setActiveUsers(current => {
        if (Math.random() > 0.5 && current.length < INITIAL_USERS.length) {
          const availableUsers = getAvailableUsers(INITIAL_USERS, current);
          if (availableUsers.length === 0) return current;
          
          const userToAdd = availableUsers[getRandomIndex(availableUsers.length)];
          return [...current, { ...userToAdd, lastSeen: new Date() }];
        } 
        
        if (current.length > 0) {
          return removeRandomUser(current);
        }
        
        return current;
      });
    };

    const interval = setInterval(updateUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex -space-x-2">
      <AnimatePresence>
        {activeUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ scale: 0, x: -10 }}
            animate={{ 
              scale: 1, 
              x: 0,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 25
              }
            }}
            exit={{ scale: 0, x: 10 }}
            whileHover={{ y: -2 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="border-2 border-background w-8 h-8 hover:ring-2 hover:ring-primary">
                    <span className="text-xs font-medium">{user.avatar}</span>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">Active now</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}