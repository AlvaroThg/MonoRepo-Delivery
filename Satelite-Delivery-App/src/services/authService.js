import AsyncStorage from '@react-native-async-storage/async-storage';
import client, { TOKEN_KEY } from '../api/client';

function unwrapData(payload) {
  return payload?.data ?? payload;
}

function mapUser(payload) {
  const user = unwrapData(payload);

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

async function persistToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

const authService = {
  async login({ email, password }) {
    const { data } = await client.post('/auth/login', { email, password });

    await persistToken(data.token);

    return {
      user: mapUser(data.user),
      token: data.token,
    };
  },

  async register({ name, email, phone, password }) {
    const { data } = await client.post('/auth/register', {
      name,
      email,
      phone,
      password,
    });

    await persistToken(data.token);

    return {
      user: mapUser(data.user),
      token: data.token,
    };
  },

  async logout() {
    try {
      await client.post('/auth/logout');
    } finally {
      await clearToken();
    }
  },

  async getProfile() {
    const { data } = await client.get('/auth/me');
    return mapUser(data);
  },

  async getSavedToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
};

export default authService;
