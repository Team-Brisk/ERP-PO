'use client';
import {
  Container, TextField, Button, Typography, Checkbox, FormControlLabel,
  Select, MenuItem, InputLabel, FormControl, Radio, RadioGroup, FormLabel,
  Paper, Grid, Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import SendIcon from '@mui/icons-material/Send';
import { useStoreData } from '@/app/hooks/useStoreData';
import { useEffect } from 'react';

type FormValues = {
  storeBill: string;
  storeRecv: string;
  ordNo: string;
  userMode: 'one' | 'all';
  userId?: string;
  billType: 'type1' | 'type2';
  include55: boolean;
  exportPrint: boolean;
};

export default function BillOrderPage() {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      storeBill: '',
      storeRecv: '',
      ordNo: 'OrdNo',
      userMode: 'one',
      billType: 'type1',
      include55: false,
      exportPrint: true
    }
  });

  const userMode = watch('userMode');
  const setPageTitle = useStoreData((state) => state.setPageTitle)
  const onSubmit = (data: FormValues) => {
    console.log('Form Submitted:', data);
  };
  useEffect(() => {
    setPageTitle("ฺBill");
  }, [setPageTitle]);
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4, background: '#ffffff' }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: 700, color: '#1976d2' }}
        >
          🧾 ใบสั่งซื้อ (Bill Order)
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* ร้านต้นทาง */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="storeBill-label">สาขาผู้สั่ง</InputLabel>
                <Controller
                  name="storeBill"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="storeBill-label" label="สาขาผู้สั่ง" {...field}>
                      <MenuItem value="branch1">สาขา 1</MenuItem>
                      <MenuItem value="branch2">สาขา 2</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* ร้านปลายทาง */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="storeRecv-label">สาขาผู้รับ</InputLabel>
                <Controller
                  name="storeRecv"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="storeRecv-label" label="สาขาผู้รับ" {...field}>
                      <MenuItem value="branchA">สาขา A</MenuItem>
                      <MenuItem value="branchB">สาขา B</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* ประเภทใบสั่ง */}
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel>ประเภทใบสั่ง</FormLabel>
                <Controller
                  name="billType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="type1" control={<Radio />} label="ทั่วไป" />
                      <FormControlLabel value="type2" control={<Radio />} label="ปัจจุบัน" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            {/* สิทธิ์ */}
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel>สิทธิ์การดูข้อมูล</FormLabel>
                <Controller
                  name="userMode"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="one" control={<Radio />} label="ของผู้ใช้คนเดียว" />
                      <FormControlLabel value="all" control={<Radio />} label="ทั้งหมด" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            {/* User ID ถ้าเลือก one */}
            {userMode === 'one' && (
              <Grid item xs={12}>
                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <TextField fullWidth label="User ID" {...field} />
                  )}
                />
              </Grid>
            )}

            {/* ออปชัน */}
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <FormControlLabel
                  control={
                    <Controller
                      name="include55"
                      control={control}
                      render={({ field }) => <Checkbox {...field} />}
                    />
                  }
                  label="กรณีมีภาษี 5.5%"
                />
                <FormControlLabel
                  control={
                    <Controller
                      name="exportPrint"
                      control={control}
                      render={({ field }) => <Checkbox {...field} />}
                    />
                  }
                  label="ออกพิมพ์"
                />
              </Box>
            </Grid>
          </Grid>

          {/* ปุ่มยืนยัน */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            endIcon={<SendIcon />}
            sx={{
              mt: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
              textTransform: 'none',
            }}
          >
            ยืนยันการออกใบสั่งซื้อ
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
