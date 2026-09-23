import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotes } from './quotesSlice';
import './QuoteWidget.css';

export default function QuoteWidget() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.quotes);
  const [quoteOfDay, setQuoteOfDay] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchQuotes());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      const today = new Date().getDate();
      let selectedQuote = null;

      if (today >= 1 && today <= 30) {
        selectedQuote = items.find((q) => q.id === today);
      }
      
      if (!selectedQuote) {
        const randomIndex = Math.floor(Math.random() * items.length);
        selectedQuote = items[randomIndex];
      }

      setQuoteOfDay(selectedQuote);
    }
  }, [items]);

  if (status === 'loading') {
    return <div className="quote-widget loading">Chargement...</div>;
  }

  if (!quoteOfDay) {
    return null;
  }

  return (
    <div className="quote-widget">
      <blockquote>
        <p>"{quoteOfDay.quote}"</p>
        <footer>— {quoteOfDay.author}</footer>
      </blockquote>
    </div>
  );
}
