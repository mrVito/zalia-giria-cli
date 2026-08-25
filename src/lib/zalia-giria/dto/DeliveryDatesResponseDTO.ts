export interface DeliveryDatesResponseDTO {
    status: true;
    enabledDates: string[];
    enabledDatesDeliveryTax: { [date: string]: string };
    minDate: string;
    startDate: string;
}
