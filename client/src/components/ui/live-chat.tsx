import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSound } from "@/hooks/use-sound";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحباً بك في Alqudimi Technology! كيف يمكنني مساعدتك اليوم؟",
      sender: "admin",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playClickSound, playNotificationSound } = useSound();
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    playClickSound();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate admin response
    setTimeout(() => {
      setIsTyping(false);
      const adminResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "شكراً لرسالتك! سنقوم بالرد عليك في أقرب وقت ممكن. يمكنك أيضاً التواصل معنا مباشرة عبر الهاتف أو البريد الإلكتروني.",
        sender: "admin",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, adminResponse]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
        playNotificationSound();
      }
    }, 1500);
  };

  const handleToggleChat = () => {
    playClickSound();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggleChat}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:scale-110 transition-all duration-300 relative"
          data-testid="button-toggle-chat"
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'} text-white text-xl`}></i>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 animate-in slide-in-from-bottom-2 duration-300">
          <Card className="modern-card h-full flex flex-col">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg p-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <i className="fas fa-headset"></i>
                تواصل مع Alqudimi Technology
              </CardTitle>
              <p className="text-xs opacity-90">نحن هنا للمساعدة</p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString('ar-SA', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1"
                    data-testid="input-chat-message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    data-testid="button-send-message"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}