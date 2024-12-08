import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Edit as EditIcon, CreditCard as CreditCardIcon, Money as MoneyIcon } from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';
import type { Rental, PaymentMethod } from '../../../shared/types';

interface RentalCardProps {
  rental: Rental;
  onEnd: (id: number) => void;
  onUpdate: (id: number, data: { customerName?: string; notes?: string; discount?: number; paymentMethod?: PaymentMethod }) => void;
}

export default function RentalCard({ rental, onEnd, onUpdate }: RentalCardProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState(rental.customerName || '');
  const [notes, setNotes] = useState(rental.notes || '');
  const [discount, setDiscount] = useState(rental.discount || 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(rental.paymentMethod || 'CASH');

  const handleUpdate = () => {
    onUpdate(rental.id!, {
      customerName,
      notes,
      discount,
      paymentMethod,
    });
    setEditDialogOpen(false);
  };

  const getTimeDisplay = () => {
    const startTime = new Date(rental.startTime!);
    const timeAgo = formatDistanceToNow(startTime, { locale: he, addSuffix: true });
    return `${format(startTime, 'HH:mm')} (${timeAgo})`;
  };

  const getPriceDisplay = () => {
    if (rental.finalPrice) {
      return `₪${rental.finalPrice}`;
    }
    return `₪${rental.basePrice}${rental.discount ? ` (-${rental.discount})` : ''}`;
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" component="div">
                {rental.customerName || 'לקוח חדש'}
              </Typography>
              {rental.paymentMethod === 'CASH' ? (
                <MoneyIcon color="success" />
              ) : (
                <CreditCardIcon color="primary" />
              )}
            </Box>
            <IconButton size="small" onClick={() => setEditDialogOpen(true)}>
              <EditIcon />
            </IconButton>
          </Box>
          
          <Typography color="text.secondary" gutterBottom>
            התחלה: {getTimeDisplay()}
          </Typography>
          
          {rental.numPeople && (
            <Typography color="text.secondary" gutterBottom>
              מספר אנשים: {rental.numPeople}
            </Typography>
          )}
          
          <Typography color="primary" gutterBottom>
            מחיר: {getPriceDisplay()}
          </Typography>

          {rental.notes && (
            <Typography color="text.secondary" variant="body2">
              הערות: {rental.notes}
            </Typography>
          )}

          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => onEnd(rental.id!)}
            >
              סיום השכרה
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>עריכת השכרה</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם לקוח"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            dir="rtl"
          />
          <TextField
            margin="dense"
            label="הערות"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            dir="rtl"
          />
          <TextField
            margin="dense"
            label="הנחה"
            type="number"
            fullWidth
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            dir="rtl"
          />
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>אמצעי תשלום</Typography>
            <ToggleButtonGroup
              value={paymentMethod}
              exclusive
              onChange={(_, value) => value && setPaymentMethod(value)}
              fullWidth
            >
              <ToggleButton value="CASH">
                <MoneyIcon sx={{ mr: 1 }} />
                מזומן
              </ToggleButton>
              <ToggleButton value="CREDIT">
                <CreditCardIcon sx={{ mr: 1 }} />
                אשראי
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleUpdate} variant="contained">
            שמירה
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 