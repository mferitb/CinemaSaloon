const container = document.querySelector('.seat-container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const sessionSelect = document.getElementById('session');
const theaterSelect = document.getElementById('theater');
const vendingItems = document.querySelectorAll('.vending-item');
const vendingTotalAmount = document.getElementById('vending-total-amount');
const vendingPurchaseBtn = document.getElementById('vending-purchase-btn');

const ticketPrice = 20; // Sabit bilet fiyatı

// Koltuk seçimi ve toplam fiyatı güncelle
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const selectedSeatsCount = selectedSeats.length;
    const seatTotal = selectedSeatsCount * ticketPrice;

    document.getElementById('count').textContent = selectedSeatsCount;
    document.getElementById('total').textContent = seatTotal;

    const selectedSeatNumbers = Array.from(selectedSeats).map(seat => seat.dataset.seatNumber);
    document.getElementById('selected-seats').textContent = selectedSeatNumbers.join(', ');

    updateVendingTotal(seatTotal);
}

// Seans ve salon seçimi değiştiğinde koltukları güncelle
sessionSelect.addEventListener('change', updateSeatsAvailability);
theaterSelect.addEventListener('change', updateSeatsAvailability);

// Koltuk seçimi
container.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

// Seans ve salon seçimine göre koltuk durumunu güncelle
function updateSeatsAvailability() {
    seats.forEach(seat => {
        seat.classList.remove('occupied');
        if (Math.random() > 0.7) {
            seat.classList.add('occupied');
        }
    });
    updateSelectedCount();
}

// Otomat ürünlerinin miktarını güncelle
function updateItemQuantity(item, change) {
    const quantityElement = item.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity += change;
    if (quantity >= 0) {
        quantityElement.textContent = quantity;
        updateVendingTotal();
    }
}

// Otomat ürünlerini seç
vendingItems.forEach(item => {
    const minusBtn = item.querySelector('.minus');
    const plusBtn = item.querySelector('.plus');

    minusBtn.addEventListener('click', () => updateItemQuantity(item, -1));
    plusBtn.addEventListener('click', () => updateItemQuantity(item, 1));
});

// Otomat toplam fiyatını güncelle
function updateVendingTotal() {
    let total = 0;
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatTotal = selectedSeats.length * ticketPrice;
    total += seatTotal;

    vendingItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        const price = parseInt(item.dataset.price);
        total += quantity * price;
    });
    vendingTotalAmount.textContent = total;
    document.getElementById('total').textContent = total;
}

// Otomat satın alma işlemi
vendingPurchaseBtn.addEventListener('click', () => {
    let purchasedItems = [];
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    if (selectedSeats.length > 0) {
        const seatNumbers = Array.from(selectedSeats).map(seat => seat.dataset.seatNumber);
        purchasedItems.push(`Koltuk ${seatNumbers.join(', ')}`);
    }
    vendingItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        if (quantity > 0) {
            purchasedItems.push(`${item.querySelector('.item-name').textContent} x${quantity}`);
            item.querySelector('.quantity').textContent = '0';
        }
    });
    if (purchasedItems.length > 0) {
        selectedSeats.forEach(seat => {
            seat.classList.remove('selected');
            seat.classList.add('occupied');
        });
        updateVendingTotal();
        alert(`Satın alınan ürünler:\n${purchasedItems.join('\n')}\nToplam Tutar: ${vendingTotalAmount.textContent}₺`);
    } else {
        alert('Lütfen en az bir koltuk seçin veya bir ürün ekleyin.');
    }
});

// Sayfa yüklendiğinde toplamı güncelle
updateVendingTotal();

