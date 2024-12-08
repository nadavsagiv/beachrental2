import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { useRentals } from '../../hooks/useRentals';
import type { Rental, PaymentMethod } from '../../shared/types';
import Timer from '../Timer';

type FilterType = 'active' | 'completed';

export default function BedsTab() {
  const { createRental, updateRental, endRental, rentals } = useRentals();
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isNewRentalDialogOpen, setNewRentalDialogOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('active');

  const filteredRentals = rentals.filter(rental => {
    if (rental.type !== 'BED') return false;
    switch (filter) {
      case 'active':
        return !rental.endTime;
      case 'completed':
        return !!rental.endTime;
      default:
        return true;
    }
  });

  const handleNewRental = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const customerName = formData.get('customerName')?.toString();
    if (!customerName) return;

    createRental.mutate({
      type: 'BED',
      numPeople: Number(formData.get('numPeople')) || 1,
      customerName,
      notes: formData.get('notes')?.toString() || '',
      paymentMethod: (formData.get('paymentMethod')?.toString() as PaymentMethod) || 'CASH',
    });
    setNewRentalDialogOpen(false);
    // Reset form fields
    event.currentTarget.reset();
  };

  const handleUpdateRental = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedRental) return;

    const formData = new FormData(event.currentTarget);
    const customerName = formData.get('customerName')?.toString();
    if (!customerName) return;

    updateRental.mutate({
      id: selectedRental.id,
      data: {
        customerName,
        notes: formData.get('notes')?.toString() || '',
        discount: Number(formData.get('discount')) || 0,
        paymentMethod: (formData.get('paymentMethod')?.toString() as PaymentMethod) || selectedRental.paymentMethod,
      }
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, value) => value && setFilter(value)}
          fullWidth
        >
          <ToggleButton value="active">פעילות</ToggleButton>
          <ToggleButton value="completed">הסתיימו</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2}>
        {filteredRentals.map((rental) => (
          <Grid item xs={12} sm={6} md={4} key={rental.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  מיטה {rental.id}
                </Typography>
                <Typography color="text.secondary">
                  התחלה: {format(new Date(rental.startTime), 'HH:mm', { locale: he })}
                </Typography>
                {!rental.endTime && (
                  <Timer startTime={rental.startTime} rentalType="BED" />
                )}
                {rental.endTime && (
                  <Typography color="text.secondary">
                    סיום: {format(new Date(rental.endTime), 'HH:mm', { locale: he })}
                  </Typography>
                )}
                <Typography>
                  מספר אנשים: {rental.numPeople}
                </Typography>
                {rental.customerName && (
                  <Typography>
                    שם: {rental.customerName}
                  </Typography>
                )}
                {rental.notes && (
                  <Typography>
                    הערות: {rental.notes}
                  </Typography>
                )}
                {rental.discount > 0 && (
                  <Typography color="error">
                    הנחה: ₪{rental.discount}
                  </Typography>
                )}
                <Typography color="primary" variant="h6">
                  מחיר: ₪{rental.finalPrice || rental.basePrice}
                </Typography>
                {!rental.endTime && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedRental(rental);
                        setEditDialogOpen(true);
                      }}
                    >
                      עריכה
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => rental.id && endRental.mutate(rental.id)}
                    >
                      סיום
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* New Rental Dialog */}
      <Dialog open={isNewRentalDialogOpen} onClose={() => setNewRentalDialogOpen(false)}>
        <form onSubmit={handleNewRental}>
          <DialogTitle>השכרת מיטה חדשה</DialogTitle>
          <DialogContent>
            <TextField
              label="מספר אנשים"
              name="numPeople"
              type="number"
              required
              fullWidth
              defaultValue={1}
              sx={{ mt: 2 }}
              inputProps={{ min: 1 }}
            />
            <TextField
              label="שם"
              name="customerName"
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="הערות"
              name="notes"
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewRentalDialogOpen(false)}>ביטול</Button>
            <Button type="submit" variant="contained">אישור</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <form onSubmit={handleUpdateRental}>
          <DialogTitle>עריכת השכרה</DialogTitle>
          <DialogContent>
            <TextField
              label="שם"
              name="customerName"
              defaultValue={selectedRental?.customerName}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="הערות"
              name="notes"
              defaultValue={selectedRental?.notes}
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 2 }}
            />
            <TextField
              label="הנחה"
              name="discount"
              type="number"
              defaultValue={selectedRental?.discount}
              fullWidth
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
            <Button type="submit" variant="contained">שמירה</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 