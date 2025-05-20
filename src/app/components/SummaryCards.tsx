'use client';
import { Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const items = [
  { title: 'Orders', value: 2, detail: '2 รายการใหม่วันนี้' },
  { title: 'Users', value: 15, detail: '15 คนที่ลงทะเบียน' },
  { title: 'Revenue', value: 697, detail: 'ยอดรวม 697 บาท' },
];

export default function SummaryCardsFlip() {
  const [counts, setCounts] = useState(items.map(() => 0));

  useEffect(() => {
    const intervals = items.map((item, idx) => {
      const increment = Math.max(1, Math.floor(item.value / 50)); // กำหนดความเร็ว
      return setInterval(() => {
        setCounts((prev) => {
          const next = [...prev];
          if (next[idx] < item.value) {
            next[idx] = Math.min(next[idx] + increment, item.value);
          }
          return next;
        });
      }, 30); // ความเร็วในการเพิ่มตัวเลข (ms)
    });

    return () => intervals.forEach(clearInterval); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  return (
    <Grid container spacing={3}>
      {items.map((item, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box sx={{ perspective: 1000 }}>
            <motion.div
              transition={{ duration: 0.8 }}
              style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #2BB1F0 0%, #8ADEF3 100%)',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }}
              >
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography variant="h3" fontWeight="bold">
                  {counts[i]}
                </Typography>
                <Typography variant="caption">↑ ∞% since last period</Typography>
              </Box>

              {/* Back */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 3,
                  background: '#fff',
                  color: '#333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  รายละเอียด
                </Typography>
                <Typography variant="caption" textAlign="center" maxWidth="80%">
                  {item.detail}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
