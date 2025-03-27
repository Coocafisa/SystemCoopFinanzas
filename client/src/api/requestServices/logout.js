import { api } from '../apiRest';

export const logout = async () => {
  try {
    await api.post('/session/logout', {skipAlert: true});
  } catch (error) {
    return [];
  } finally {
    sessionStorage.removeItem('token');
    
    window.location.href = '/';
  }
}

  export const deleteSession = async (data) => {
    try {
      await api.post('/session/deleteSession', {
      data
    });
    } catch (error) {
      return [];
    }
  }