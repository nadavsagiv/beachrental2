import { Paper, Grid, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRentals } from '../hooks/useRentals';
import { useState } from 'react';
import api from '../utils/api';

interface DailySummaryData {
  totalRevenue: number;
  totalDiscounts: number;
  totalRentals: number;
  bedRentals: number;
  supRentals: number;
  snorkelRentals: number;
}

interface ResetResponse {
  success: boolean;
  message: string;
  summary?: DailySummaryData;
  error?: string;
  details?: {
    rentalsDeleted: number;
  };
}

export default function DailySummary() {
  const { rentals } = useRentals();
  const [isResetDialogOpen, setResetDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  // Reset day mutation
  const resetDay = useMutation({
    mutationFn: async () => {
      try {
        console.log('Sending reset request...');
        const response = await api.post<ResetResponse>('/daily-summary/reset');
        console.log('Reset response:', response.data);
        
        if (!response.data.success) {
          throw new Error(response.data.error || 'Reset failed');
        }
        
        return response.data;
      } catch (error) {
        console.error('Reset request failed:', error);
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error || error.message;
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
    onMutate: () => {
      setErrorMessage(null);
      setSuccessMessage(null);
    },
    onSuccess: (data) => {
      console.log('Reset successful:', data);
      const rentalsDeleted = data.details?.rentalsDeleted || 0;
      const successMsg = `היום אופס בהצלחה. נמחקו ${rentalsDeleted} השכרות.`;
      setSuccessMessage(successMsg);
      
      // Invalidate and refetch all relevant queries
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['dailySummary'] });
      
      // Close dialog and reload after a short delay
      setTimeout(() => {
        setResetDialogOpen(false);
        window.location.reload();
      }, 1500);
    },
    onError: (error: Error) => {
      console.error('Reset failed:', error);
      setErrorMessage(`שגיאה באיפוס היום: ${error.message}`);
    }
  });

  // Calculate totals from all rentals (both active and completed)
  const totals = rentals.reduce((acc, rental) => {
    const baseAmount = rental.basePrice;
    const finalAmount = rental.finalPrice || rental.basePrice;
    const discount = rental.discount || 0;

    return {
      totalRevenue: acc.totalRevenue + finalAmount,
      totalDiscounts: acc.totalDiscounts + discount,
      totalRentals: acc.totalRentals + 1,
      bedRentals: acc.bedRentals + (rental.type === 'BED' ? 1 : 0),
      supRentals: acc.supRentals + (rental.type === 'SUP' ? 1 : 0),
      snorkelRentals: acc.snorkelRentals + (rental.type === 'SNORKEL' ? 1 : 0),
    };
  }, {
    totalRevenue: 0,
    totalDiscounts: 0,
    totalRentals: 0,
    bedRentals: 0,
    supRentals: 0,
    snorkelRentals: 0,
  });

  const handleReset = () => {
    console.log('Starting reset...');
    resetDay.mutate();
  };

  return (
    <>
      <Paper sx={{ p: 2, m: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Box textAlign="center">
              <Typography variant="h6">הכנסות</Typography>
              <Typography variant="h4">₪{totals.totalRevenue}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center">
              <Typography variant="h6">הנחות</Typography>
              <Typography variant="h4" color="error">₪{totals.totalDiscounts}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center">
              <Typography variant="h6">השכרות</Typography>
              <Typography variant="h4">{totals.totalRentals}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center">
              <Typography variant="h6">מיטות</Typography>
              <Typography variant="h4">{totals.bedRentals}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center">
              <Typography variant="h6">סאפים</Typography>
              <Typography variant="h4">{totals.supRentals}</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box textAlign="center">
              <Typography variant="h6">שנורקלים</Typography>
              <Typography variant="h4">{totals.snorkelRentals}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setResetDialogOpen(true)}
            sx={{ minWidth: 120 }}
          >
            סיום יום
          </Button>
        </Box>
      </Paper>

      {/* Reset Confirmation Dialog */}
      <Dialog 
        open={isResetDialogOpen} 
        onClose={() => !resetDay.isPending && !errorMessage && setResetDialogOpen(false)}
      >
        <DialogTitle>סיום יום</DialogTitle>
        <DialogContent>
          {resetDay.isPending ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, gap: 2 }}>
              <CircularProgress />
              <Typography>מאפס את היום...</Typography>
            </Box>
          ) : (
            <Typography>
              האם אתה בטוח שברצונך לסיים את היום?
              <br />
              פעולה זו תמחק את כל ההשכרות ותאפס את הסיכומים.
            </Typography>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setErrorMessage(null);
              setResetDialogOpen(false);
            }}
            disabled={resetDay.isPending}
          >
            ביטול
          </Button>
          <Button
            onClick={handleReset}
            variant="contained"
            color="warning"
            disabled={resetDay.isPending}
          >
            {resetDay.isPending ? 'מאפס...' : 'סיום יום'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={1500} 
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
} 