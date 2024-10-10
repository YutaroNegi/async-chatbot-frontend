import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface MessageResponse {
  messages: {
    id_message: string;
    content: string;
    is_bot: boolean;
    timestamp: string;
  }[];
}

interface SendMessageResponse {
  user_message: {
    id_message: string;
    content: string;
    is_bot: boolean;
    timestamp: string;
  };
  bot_response: {
    id_message: string;
    content: string;
    is_bot: boolean;
    timestamp: string;
  };
}

interface EditMessageResponse {
  id_message: string;
  content: string;
  timestamp: string;
}

interface DeleteMessageResponse {
  id_message: string;
  status: string;
}

export const getMessages = () => {
  return axios.get<MessageResponse>(`${API_URL}/messages/`, {
    withCredentials: true,
  });
};

export const sendMessage = (content: string) => {
  return axios.post<SendMessageResponse>(
    `${API_URL}/messages/`,
    { content },
    { withCredentials: true }
  );
};

export const editMessage = (id_message: string, content: string) => {
  return axios.put<EditMessageResponse>(
    `${API_URL}/messages/${id_message}`,
    { content },
    { withCredentials: true }
  );
};

export const deleteMessage = (id_message: string) => {
  return axios.delete<DeleteMessageResponse>(
    `${API_URL}/messages/${id_message}`,
    {
      withCredentials: true,
    }
  );
};
