import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../../shared/pagination/pagination';
import { Alertservice } from '../../../../../core/services/alertservice';
import { Spinnerservice } from '../../../../../core/services/spinnerservice';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
   submitted = false;
  isEdit = false;

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = '';

  orders: any[] = [];

  order: any = {

    orderId: 0,
    orderNumber: '',
    orderName: '',
    quotation: '',
    account: '',
    contact: '',
    salesExecutive: '',
    orderDate: '',
    deliveryDate: '',
    paymentMethod: '',
    tax: 0,
    discount: 0,
    shippingCharges: 0,
    orderAmount: 0,
    shippingAddress: '',
    billingAddress: '',
    description: '',
    status: '',
    isActive: true

  };

  constructor(
    private alert: Alertservice,
    private spinner: Spinnerservice,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadOrders();

  }

  loadOrders() {

    this.spinner.show();

    setTimeout(() => {

      this.orders = [

        {
          orderId: 1,
          orderNumber: 'ORD1001',
          orderName: 'CRM Software Order',
          quotation: 'CRM Software Proposal',
          account: 'ABC Technologies',
          contact: 'Rahul Sharma',
          salesExecutive: 'Karishma',
          orderDate: '2026-07-29',
          deliveryDate: '2026-08-10',
          paymentMethod: 'Bank Transfer',
          tax: 18,
          discount: 5,
          shippingCharges: 2000,
          orderAmount: 250000,
          shippingAddress: 'Hyderabad',
          billingAddress: 'Hyderabad',
          description: 'CRM Software implementation order.',
          status: 'Pending',
          isActive: true
        },

        {
          orderId: 2,
          orderNumber: 'ORD1002',
          orderName: 'HRMS Implementation',
          quotation: 'HRMS Proposal',
          account: 'XYZ Solutions',
          contact: 'Priya Reddy',
          salesExecutive: 'Rahul',
          orderDate: '2026-07-28',
          deliveryDate: '2026-08-08',
          paymentMethod: 'UPI',
          tax: 18,
          discount: 3,
          shippingCharges: 1000,
          orderAmount: 180000,
          shippingAddress: 'Bangalore',
          billingAddress: 'Bangalore',
          description: 'HRMS software order.',
          status: 'Processing',
          isActive: true
        },

        {
          orderId: 3,
          orderNumber: 'ORD1003',
          orderName: 'ERP Integration',
          quotation: 'ERP Integration Proposal',
          account: 'Future Vision',
          contact: 'Arjun Kumar',
          salesExecutive: 'Sneha',
          orderDate: '2026-07-26',
          deliveryDate: '2026-08-06',
          paymentMethod: 'Cheque',
          tax: 18,
          discount: 10,
          shippingCharges: 3500,
          orderAmount: 420000,
          shippingAddress: 'Pune',
          billingAddress: 'Pune',
          description: 'ERP Integration Order.',
          status: 'Shipped',
          isActive: true
        },

        {
          orderId: 4,
          orderNumber: 'ORD1004',
          orderName: 'Cloud Migration',
          quotation: 'Cloud Migration Proposal',
          account: 'Global InfoTech',
          contact: 'Sneha Patel',
          salesExecutive: 'Arun',
          orderDate: '2026-07-24',
          deliveryDate: '2026-08-04',
          paymentMethod: 'Credit Card',
          tax: 18,
          discount: 2,
          shippingCharges: 2500,
          orderAmount: 520000,
          shippingAddress: 'Mumbai',
          billingAddress: 'Mumbai',
          description: 'Cloud migration order.',
          status: 'Delivered',
          isActive: true
        },

        {
          orderId: 5,
          orderNumber: 'ORD1005',
          orderName: 'Digital Marketing Package',
          quotation: 'Digital Marketing Package',
          account: 'NextGen Pvt Ltd',
          contact: 'Kiran Verma',
          salesExecutive: 'Durga',
          orderDate: '2026-07-22',
          deliveryDate: '2026-08-01',
          paymentMethod: 'Cash',
          tax: 18,
          discount: 8,
          shippingCharges: 500,
          orderAmount: 95000,
          shippingAddress: 'Hyderabad',
          billingAddress: 'Hyderabad',
          description: 'Marketing package order.',
          status: 'Cancelled',
          isActive: true
        }

      ];

      this.orders.sort(
        (a, b) => b.orderId - a.orderId
      );

      this.totalRecords = this.orders.length;

      this.spinner.hide();

      this.cd.detectChanges();

    }, 500);

  }

  saveOrder() {

    this.submitted = true;

    if (
      !this.order.orderNumber ||
      !this.order.orderName ||
      !this.order.quotation ||
      !this.order.account ||
      !this.order.contact ||
      !this.order.orderDate ||
      !this.order.status
    ) {
      return;
    }

    this.spinner.show();

    setTimeout(() => {

      if (!this.isEdit) {

        const newOrder = {

          ...this.order,

          orderId: this.orders.length
            ? Math.max(...this.orders.map(x => x.orderId)) + 1
            : 1

        };

        this.orders.unshift(newOrder);

      } else {

        const index = this.orders.findIndex(
          x => x.orderId === this.order.orderId
        );

        if (index !== -1) {

          this.orders[index] = {

            ...this.order

          };

        }

      }

      this.orders = [...this.orders];

      this.totalRecords = this.orders.length;

      this.page = 1;

      this.clear();

      this.spinner.hide();

      this.cd.detectChanges();

      this.alert.success(
        this.isEdit
          ? 'Order updated successfully.'
          : 'Order created successfully.'
      );

    }, 500);

  }
    edit(id: number) {

    this.spinner.show();

    setTimeout(() => {

      const selected = this.orders.find(
        x => x.orderId === id
      );

      if (selected) {

        this.order = {
          ...selected
        };

        this.isEdit = true;

        this.submitted = false;

        this.cd.detectChanges();

      }

      this.spinner.hide();

    }, 300);

  }

  delete(id: number) {

    this.alert.deleteConfirm().then(result => {

      if (result.isConfirmed) {

        this.spinner.show();

        setTimeout(() => {

          this.orders = this.orders.filter(
            x => x.orderId !== id
          );

          this.totalRecords = this.orders.length;

          if (
            this.page > 1 &&
            this.pagedOrders.length === 0
          ) {

            this.page--;

          }

          this.orders = [...this.orders];

          this.spinner.hide();

          this.cd.detectChanges();

          this.alert.success(
            'Order deleted successfully.'
          );

        }, 500);

      }

    });

  }

  clear() {

    this.order = {

      orderId: 0,
      orderNumber: '',
      orderName: '',
      quotation: '',
      account: '',
      contact: '',
      salesExecutive: '',
      orderDate: '',
      deliveryDate: '',
      paymentMethod: '',
      tax: 0,
      discount: 0,
      shippingCharges: 0,
      orderAmount: 0,
      shippingAddress: '',
      billingAddress: '',
      description: '',
      status: '',
      isActive: true

    };

    this.isEdit = false;

    this.submitted = false;

    this.cd.detectChanges();

  }

  get filteredOrders() {

    return this.orders.filter(x =>

      x.orderNumber
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.orderName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.quotation
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.account
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.contact
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.salesExecutive
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      x.status
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get pagedOrders() {

    const start = (this.page - 1) * this.pageSize;

    return this.filteredOrders.slice(
      start,
      start + this.pageSize
    );

  }

  changePage(page: number) {

    this.page = page;

  }

  changePageSize(size: number) {

    this.pageSize = size;

    this.page = 1;

  }


}
