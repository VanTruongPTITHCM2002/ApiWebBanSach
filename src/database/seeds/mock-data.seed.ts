import * as bcrypt from 'bcrypt';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

import { Account } from '@/accounts/entities/account.entity';
import { Author } from '@/authors/entities/author.entity';
import { Book } from '@/books/entities/book.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { Cartitem } from '@/cartitems/entities/cartitem.entity';
import { Category } from '@/categories/entities/category.entity';
import { Employee } from '@/employees/entity/employee.entity';
import { RoleEnum } from '@/enum/role.enum';
import {
  Invoice,
  PaymentMethod,
  PaymentStatus,
} from '@/invoice/entities/invoice.entity';
import { InvoiceItem } from '@/invoiceitem/entities/invoiceitem.entity';
import { Order } from '@/orders/entities/order.entity';
import { Orderdetail } from '@/orderdetail/entities/orderdetail.entity';
import { Publisher } from '@/publishers/entities/publisher.entity';
import { Review } from '@/reviews/entities/review.entity';
import { Role } from '@/roles/entities/role.entity';
import { User } from '@/users/entities/user.entity';

const DEMO_PASSWORD = 'user1234';

/**
 * Tìm bản ghi theo khóa tự nhiên, nếu chưa có thì tạo mới.
 * Nhờ vậy chạy seed nhiều lần cũng không sinh dữ liệu trùng.
 */
async function ensure<T extends ObjectLiteral>(
  repo: Repository<T>,
  where: FindOptionsWhere<T>,
  data: DeepPartial<T>,
): Promise<T> {
  const existing = await repo.findOne({ where });
  if (existing) {
    return existing;
  }
  return repo.save(repo.create(data));
}

async function seedRoles(manager: EntityManager) {
  const repo = manager.getRepository(Role);

  const admin = await ensure(
    repo,
    { roleName: RoleEnum.ADMIN },
    {
      roleName: RoleEnum.ADMIN,
    },
  );
  const user = await ensure(
    repo,
    { roleName: RoleEnum.USER },
    {
      roleName: RoleEnum.USER,
    },
  );

  return { admin, user };
}

async function seedUsers(manager: EntityManager, userRole: Role) {
  const accountRepo = manager.getRepository(Account);
  const userRepo = manager.getRepository(User);
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);

  const createUser = async (input: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    address: string;
    phone: string;
  }) => {
    const account = await ensure(
      accountRepo,
      { username: input.username },
      {
        username: input.username,
        password,
        roleId: userRole,
        isActive: true,
      },
    );

    return ensure(
      userRepo,
      { email: input.email },
      {
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        address: input.address,
        phone: input.phone,
        accountFK: account,
        isActive: true,
      },
    );
  };

  const an = await createUser({
    username: 'nguyenvana',
    firstname: 'Nguyễn',
    lastname: 'Văn An',
    email: 'nguyenvana@bookstore.local',
    address: '12 Nguyễn Huệ, TP.HCM',
    phone: '0901234567',
  });

  const binh = await createUser({
    username: 'tranthib',
    firstname: 'Trần',
    lastname: 'Thị Bình',
    email: 'tranthib@bookstore.local',
    address: '45 Lê Lợi, Hà Nội',
    phone: '0912345678',
  });

  return { an, binh, accounts: { an: an.accountFK, binh: binh.accountFK } };
}

async function seedCatalog(manager: EntityManager) {
  const authorRepo = manager.getRepository(Author);
  const publisherRepo = manager.getRepository(Publisher);
  const categoryRepo = manager.getRepository(Category);
  const bookRepo = manager.getRepository(Book);

  const rowling = await ensure(
    authorRepo,
    { firstname: 'J. K.', lastname: 'Rowling' },
    { firstname: 'J. K.', lastname: 'Rowling', country: 'Anh', quantity: 2 },
  );

  const nha = await ensure(
    authorRepo,
    { firstname: 'Nguyễn Nhật', lastname: 'Ánh' },
    {
      firstname: 'Nguyễn Nhật',
      lastname: 'Ánh',
      country: 'Việt Nam',
      quantity: 2,
    },
  );

  const tre = await ensure(
    publisherRepo,
    { publisherName: 'NXB Trẻ' },
    {
      publisherName: 'NXB Trẻ',
      publisherAddress: '161B Lý Chính Thắng, TP.HCM',
    },
  );

  const kimDong = await ensure(
    publisherRepo,
    { publisherName: 'NXB Kim Đồng' },
    {
      publisherName: 'NXB Kim Đồng',
      publisherAddress: '55 Quang Trung, Hà Nội',
    },
  );

  const tieuThuyet = await ensure(
    categoryRepo,
    { categoryName: 'Tiểu thuyết' },
    { categoryName: 'Tiểu thuyết' },
  );

  const thieuNhi = await ensure(
    categoryRepo,
    { categoryName: 'Thiếu nhi' },
    { categoryName: 'Thiếu nhi' },
  );

  const createBook = (input: {
    title: string;
    authorId: Author;
    publisher: Publisher;
    category: Category;
    price: number;
    stock: number;
    thumbnail: string;
  }) =>
    ensure(
      bookRepo,
      { title: input.title },
      {
        title: input.title,
        authorId: input.authorId,
        publisher: input.publisher,
        category: input.category,
        price: input.price,
        stock: input.stock,
        status: true,
        isDeleted: false,
        thumbnail: input.thumbnail,
        images: [input.thumbnail],
      },
    );

  const hp1 = await createBook({
    title: 'Harry Potter và Hòn Đá Phù Thủy',
    authorId: rowling,
    publisher: kimDong,
    category: tieuThuyet,
    price: 150000,
    stock: 20,
    thumbnail: 'https://placehold.co/300x400?text=Harry+Potter+1',
  });

  const hp2 = await createBook({
    title: 'Harry Potter và Phòng Chứa Bí Mật',
    authorId: rowling,
    publisher: kimDong,
    category: tieuThuyet,
    price: 165000,
    stock: 15,
    thumbnail: 'https://placehold.co/300x400?text=Harry+Potter+2',
  });

  const veTuoiTho = await createBook({
    title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ',
    authorId: nha,
    publisher: tre,
    category: thieuNhi,
    price: 90000,
    stock: 30,
    thumbnail: 'https://placehold.co/300x400?text=Ve+Tuoi+Tho',
  });

  const matBiec = await createBook({
    title: 'Mắt Biếc',
    authorId: nha,
    publisher: tre,
    category: tieuThuyet,
    price: 110000,
    stock: 25,
    thumbnail: 'https://placehold.co/300x400?text=Mat+Biec',
  });

  return { hp1, hp2, veTuoiTho, matBiec };
}

async function seedEmployees(manager: EntityManager) {
  const repo = manager.getRepository(Employee);

  await ensure(
    repo,
    { name: 'Lê Minh Quân' },
    {
      name: 'Lê Minh Quân',
      position: 'Quản lý cửa hàng',
      salary: 15000000,
    },
  );

  await ensure(
    repo,
    { name: 'Phạm Thu Hà' },
    {
      name: 'Phạm Thu Hà',
      position: 'Nhân viên bán hàng',
      salary: 8000000,
    },
  );
}

async function seedCarts(
  manager: EntityManager,
  users: { an: User; binh: User },
  books: { hp1: Book; hp2: Book; veTuoiTho: Book },
) {
  const cartRepo = manager.getRepository(Cart);
  const itemRepo = manager.getRepository(Cartitem);

  const createCart = (user: User, cartCode: string) =>
    ensure(
      cartRepo,
      { cartCode },
      {
        cartCode,
        usersId: user,
        createAt: new Date(),
        isActive: true,
      },
    );

  const addItem = (
    cartItemCode: string,
    cart: Cart,
    book: Book,
    quantity: number,
  ) =>
    ensure(
      itemRepo,
      { cartItemCode },
      {
        cartItemCode,
        carts: cart,
        bookId: book,
        quantity,
        price: book.price,
      },
    );

  const anCart = await createCart(users.an, 'CRT-SEED0001');
  await addItem('CRI-SEED0001', anCart, books.hp1, 1);
  await addItem('CRI-SEED0002', anCart, books.veTuoiTho, 2);

  const binhCart = await createCart(users.binh, 'CRT-SEED0002');
  await addItem('CRI-SEED0003', binhCart, books.hp2, 1);
}

async function seedOrders(
  manager: EntityManager,
  users: { an: User; binh: User },
  books: { hp1: Book; hp2: Book; veTuoiTho: Book },
) {
  const orderRepo = manager.getRepository(Order);
  const detailRepo = manager.getRepository(Orderdetail);

  const createOrder = (
    orderCode: string,
    user: User,
    totalAmount: number,
    methodPay: string,
    workflowStatus: number,
    customerName: string,
  ) =>
    ensure(
      orderRepo,
      { orderCode },
      {
        orderCode,
        userId: user,
        orderDate: new Date(),
        totalAmount,
        methodPay,
        customerName,
        phone: user.phone,
        address: user.address,
        workflowStatus,
        isActive: true,
      },
    );

  const addDetail = (
    order: Order,
    orderDetailCode: string,
    book: Book,
    quantity: number,
  ) =>
    ensure(
      detailRepo,
      { orderDetailCode },
      {
        orderDetailCode,
        orderId: order,
        books: book,
        quantity,
        price: book.price,
      },
    );

  const order1 = await createOrder(
    'ORD-SEED0001',
    users.an,
    330000,
    'COD',
    1,
    `${users.an.firstname} ${users.an.lastname}`,
  );
  await addDetail(order1, 'ODT-SEED0001', books.hp1, 1);
  await addDetail(order1, 'ODT-SEED0002', books.veTuoiTho, 2);

  const order2 = await createOrder(
    'ORD-SEED0002',
    users.binh,
    165000,
    'BANKING',
    0,
    `${users.binh.firstname} ${users.binh.lastname}`,
  );
  await addDetail(order2, 'ODT-SEED0003', books.hp2, 1);

  return { order1, order2 };
}

async function seedInvoices(
  manager: EntityManager,
  users: { an: User; binh: User },
  books: { hp1: Book; hp2: Book; veTuoiTho: Book },
  orders: { order1: Order; order2: Order },
) {
  const invoiceRepo = manager.getRepository(Invoice);
  const itemRepo = manager.getRepository(InvoiceItem);

  const invoice1 = await ensure(
    invoiceRepo,
    { invoiceCode: 'INV-SEED0001' },
    {
      invoiceCode: 'INV-SEED0001',
      userId: users.an,
      order: orders.order1,
      issueDate: new Date(),
      subtotal: 330000,
      vatPercent: 8,
      vatAmount: 26400,
      shippingFee: 30000,
      discountAmount: 0,
      totalAmount: 386400,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.BANK,
      note: 'Hóa đơn mẫu cho đơn hàng ORD-SEED0001',
      isActive: true,
    },
  );

  const invoice2 = await ensure(
    invoiceRepo,
    { invoiceCode: 'INV-SEED0002' },
    {
      invoiceCode: 'INV-SEED0002',
      userId: users.binh,
      order: orders.order2,
      issueDate: new Date(),
      subtotal: 165000,
      vatPercent: 8,
      vatAmount: 13200,
      shippingFee: 30000,
      discountAmount: 0,
      totalAmount: 208200,
      paymentStatus: PaymentStatus.UNPAID,
      paymentMethod: PaymentMethod.COD,
      note: 'Hóa đơn mẫu cho đơn hàng ORD-SEED0002',
      isActive: true,
    },
  );

  const addItem = (
    invoiceItemCode: string,
    invoice: Invoice,
    book: Book,
    quantity: number,
    discount = 0,
  ) =>
    ensure(
      itemRepo,
      { invoiceItemCode },
      {
        invoiceItemCode,
        invoice,
        book,
        quantity,
        unitPrice: book.price,
        discount,
        totalLine: book.price * quantity - discount,
      },
    );

  await addItem('IVT-SEED0001', invoice1, books.hp1, 1);
  await addItem('IVT-SEED0002', invoice1, books.veTuoiTho, 2);
  await addItem('IVT-SEED0003', invoice2, books.hp2, 1);
}

async function seedReviews(
  manager: EntityManager,
  accounts: { an: Account; binh: Account },
  books: { hp1: Book; veTuoiTho: Book },
) {
  const repo = manager.getRepository(Review);

  await ensure(
    repo,
    { reviewCode: 'REV-SEED0001' },
    {
      reviewCode: 'REV-SEED0001',
      accountName: accounts.an,
      books: books.hp1,
      rating: 5,
      comment: 'Sách hay, giao hàng nhanh.',
      reviewDate: new Date(),
      isActive: true,
    },
  );

  await ensure(
    repo,
    { reviewCode: 'REV-SEED0002' },
    {
      reviewCode: 'REV-SEED0002',
      accountName: accounts.binh,
      books: books.hp1,
      rating: 4,
      comment: 'Nội dung hấp dẫn, bìa đẹp.',
      reviewDate: new Date(),
      isActive: true,
    },
  );

  await ensure(
    repo,
    { reviewCode: 'REV-SEED0003' },
    {
      reviewCode: 'REV-SEED0003',
      accountName: accounts.an,
      books: books.veTuoiTho,
      rating: 5,
      comment: 'Rất đáng đọc, hoài niệm tuổi thơ.',
      reviewDate: new Date(),
      isActive: true,
    },
  );
}

/**
 * Tạo một bộ dữ liệu mẫu nhỏ (2 user, 4 sách, 2 đơn hàng, ...).
 * An toàn khi chạy lặp lại: mọi bản ghi đều được kiểm tra trước khi tạo.
 */
export async function seedMockData(dataSource: DataSource): Promise<void> {
  await dataSource.transaction(async (manager) => {
    const roles = await seedRoles(manager);
    const users = await seedUsers(manager, roles.user);
    const books = await seedCatalog(manager);
    await seedEmployees(manager);
    await seedCarts(manager, users, books);
    const orders = await seedOrders(manager, users, books);
    await seedInvoices(manager, users, books, orders);
    await seedReviews(manager, users.accounts, books);
  });
}
