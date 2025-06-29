import React, { useState, useEffect, useRef } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Configuration
const MAX_MESSAGES = 5; // Number of messages to display
const BASE_SPACING = 1.0; // Vertical spacing between messages
const MESSAGE_WIDTH = 2.0; // Maximum width of message bubbles
const MAX_CHARS = 500; // Significantly increased character limit for messages

// Message colors
const USER_BUBBLE_COLOR = "#0B93F6"; // iOS blue for user messages
const BOT_BUBBLE_COLOR = "#E5E5EA"; // iOS grey for bot messages
const USER_TEXT_COLOR = "#FFFFFF"; // White text for user messages
const BOT_TEXT_COLOR = "#000000"; // Black text for bot messages

const TextResponse = () => {
  const [messages, setMessages] = useState([]);
  const lastResponseRef = useRef("");
  const lastUserInputRef = useRef("");
  const groupRef = useRef();
  
  // Animate the group with a gentle floating motion
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Position text messages just above the chatbot input
      // Add a slight floating motion for better visual effect
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05 - 2;
    }
  });

  // Format text with line breaks for better readability
  const formatText = (inputText, maxCharsPerLine = 18) => {
    if (!inputText) return "";
    
    // Handle very long messages by breaking them into multiple chunks
    // if needed for better performance
    if (inputText.length > MAX_CHARS) {
      const truncated = inputText.substring(0, MAX_CHARS - 3) + "...";
      inputText = truncated;
    }
    
    const paragraphs = inputText.split('\n');
    let formattedParagraphs = [];
    
    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        formattedParagraphs.push('');
        continue;
      }
      
      const words = paragraph.split(' ');
      let currentLine = words[0];
      let formattedParagraph = '';
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        
        if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
          currentLine += ' ' + word;
        } else {
          formattedParagraph += currentLine + '\n';
          currentLine = word;
        }
      }
      
      formattedParagraph += currentLine;
      formattedParagraphs.push(formattedParagraph);
    }
    
    return formattedParagraphs.join('\n\n');
  };
  
  // Update messages when either globalResponse or userInput changes
  useEffect(() => {
    // Initialize window.userInput if it doesn't exist
    if (!window.userInput) window.userInput = "";
    
    const interval = setInterval(() => {
      // Check for new bot response
      if (window.globalResponse && window.globalResponse !== lastResponseRef.current) {
        // Use the full response text instead of truncating
        const formattedText = formatText(window.globalResponse);
        lastResponseRef.current = window.globalResponse;
        
        // Add bot message
        setMessages(prevMessages => {
          const newMessages = [...prevMessages, { text: formattedText, isUser: false }];
          return newMessages.slice(-MAX_MESSAGES);
        });
      }
      
      // Check for new user input
      if (window.userInput && window.userInput !== lastUserInputRef.current) {
        // Use the full user input instead of truncating
        const formattedText = formatText(window.userInput);
        lastUserInputRef.current = window.userInput;
        
        // Add user message
        setMessages(prevMessages => {
          const newMessages = [...prevMessages, { text: formattedText, isUser: true }];
          return newMessages.slice(-MAX_MESSAGES);
        });
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Don't render anything if there are no messages
  if (messages.length === 0) return null;
  
  // Calculate roughly how many lines each message has to apply proper spacing
  const getMessageHeight = (text) => {
    if (!text) return 0;
    const lineCount = text.split('\n').length;
    return lineCount * 0.15; // Height per line
  };
  
  // Calculate total height for all messages
  const calculateOffset = (index) => {
    let totalOffset = 0;
    // Add up heights of all messages that come after this one
    for (let i = index + 1; i < messages.length; i++) {
      totalOffset += getMessageHeight(messages[i].text) + BASE_SPACING;
    }
    return totalOffset;
  };
  
  // Function to calculate appropriate bubble width based on text content
  const calculateBubbleWidth = (text) => {
    const lines = text.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length));
    
    // Scale the width based on line length, with constraints
    let bubbleWidth = Math.min(MESSAGE_WIDTH, maxLineLength * 0.05 + 0.5);
    return Math.max(bubbleWidth, 0.8); // Ensure minimum width
  };
  
  return (
    <>
      {/* Add lighting specific to the text bubbles */}
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 2]} intensity={1} />
      
      {/* Position group to appear right above the chatbot input */}
      <group position={[-4.4, 0, -4]} rotation={[0, 0, 0]} scale={1} ref={groupRef}>
        {messages.map((message, index) => {
          const { text, isUser } = message;
          const offset = calculateOffset(index);
          const messageHeight = getMessageHeight(text);
          const xOffset = isUser ? 0.8 : -0.8; // Right for user, left for bot
          
          // Calculate bubble dimensions with improved sizing
          const bubbleWidth = calculateBubbleWidth(text);
          const bubbleHeight = messageHeight + 0.2;
          
          return (
            <group key={index} position={[xOffset, offset, 0]}>
              {/* Message bubble */}
              <RoundedBox
                args={[bubbleWidth, bubbleHeight, 0.1]}
                radius={0.1}
                smoothness={4}
                position={[0, bubbleHeight/2 - 0.05, -0.05]}
                castShadow
              >
                <meshStandardMaterial 
                  color={isUser ? USER_BUBBLE_COLOR : BOT_BUBBLE_COLOR} 
                  roughness={0.2}
                  metalness={0.1}
                />
              </RoundedBox>
              
              {/* Bubble "tail" */}
              <mesh
                position={[isUser ? bubbleWidth/2 - 0.1 : -bubbleWidth/2 + 0.1, 0, -0.05]}
                rotation={[0, 0, isUser ? Math.PI/4 : -Math.PI/4]}
                castShadow
              >
                <boxGeometry args={[0.15, 0.15, 0.1]} />
                <meshStandardMaterial 
                  color={isUser ? USER_BUBBLE_COLOR : BOT_BUBBLE_COLOR}
                  roughness={0.2}
                  metalness={0.1}
                />
              </mesh>
              
              {/* Message text */}
              <Text
                position={[0, bubbleHeight/2 - 0.05, .1]}
                fontSize={0.1}
                maxWidth={bubbleWidth - 0.3}
                lineHeight={1.5}
                letterSpacing={0.01}
                textAlign="center"
                font="/JMH Typewriter.ttf"
                color={isUser ? USER_TEXT_COLOR : BOT_TEXT_COLOR}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.005}
                outlineColor={isUser ? "#0069c2" : "#bbbbc8"}
                whiteSpace="normal"
              >
                {text}
              </Text>
            </group>
          );
        })}
      </group>
    </>
  );
};

export default TextResponse; 