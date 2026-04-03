export const formatDate = (dateString: string) => {
     if (!dateString) return '';
     const d = new Date(dateString);
     if (isNaN(d.getTime())) return dateString;
     return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

export const formatTime = (timeString: string) => {
      if (!timeString) return '';
      const [h, m] = timeString.split(':');
      if (!h || !m) return timeString;
      const d = new Date();
      d.setHours(Number(h), Number(m));
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }