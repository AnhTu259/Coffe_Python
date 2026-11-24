import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listOrders,
  updateOrder,
  inventorySummary,
  inventoryMovements,
  inventoryImport,
  inventoryExport,
} from './api';

const STATUS_OPTIONS = [
  { label: 'Chờ xử lý', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Đang giao', value: 'delivering' },
  { label: 'Hoàn tất', value: 'delivered' },
  { label: 'Hủy', value: 'cancelled' },
];

const emptyProductForm = {
  name: '',
  price: '',
  category: '',
  description: '',
  image_url: '',
  in_stock: true,
  stock_quantity: '',
};

const emptyMovementForm = {
  product_id: '',
  quantity: '',
  note: '',
  type: 'import',
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const formatCurrency = (value = 0) => currencyFormatter.format(Number(value) || 0);
const formatDateTime = (value) => new Date(value).toLocaleString('vi-VN', { hour12: false });

const Alert = ({ type = 'info', message }) => (message ? <div className={`alert ${type}`}>{message}</div> : null);

const StatCard = ({ title, value, subtitle, accent }) => (
  <div className="stat-card" data-accent={accent}>
    <p className="stat-label">{title}</p>
    <p className="stat-value">{value}</p>
    <p className="stat-sub">{subtitle}</p>
  </div>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.64 0-9 1.82-9 5.25V21h18v-1.75C21 15.82 15.64 14 12 14z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
    <path
      fill="currentColor"
      d="M16 13v-2H7V8l-5 4 5 4v-3h9zm2-10h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
    />
  </svg>
);

function Products({ onChanged }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProductForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const defaultCategories = ['Espresso','Cappuccino','Latte','Americano','Mocha','Frappuccino'];

  // Load the product list from the API
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listProducts();
      setProducts(data);
      // Extract unique, non-empty categories from the product list and merge with defaults
      const uniqueCategories = [...new Set(data.map((p) => p.category).filter(Boolean))];
      setCategories([...new Set([...defaultCategories, ...uniqueCategories])]);
    } catch (error) {
      setAlert({ type: 'error', message: 'Không thể tải danh sách sản phẩm.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Helper to show temporary feedback messages
  const flash = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  // Submit form for both create and update flows
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price) || 0,
      category: form.category.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      in_stock: !!form.in_stock,
      stock_quantity: parseInt(form.stock_quantity || '0', 10),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        flash('Đã cập nhật sản phẩm.');
      } else {
        await createProduct(payload);
        flash('Đã tạo sản phẩm mới.');
      }
      setForm(emptyProductForm);
      setEditingId(null);
      await loadProducts();
      onChanged?.();
    } catch (error) {
      flash('Không thể lưu sản phẩm.', 'error');
    }
  };

  // Prepare form for editing the selected product
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category || '',
      description: product.description || '',
      image_url: product.image_url || '',
      in_stock: product.in_stock,
      stock_quantity: product.stock_quantity ?? '',
    });
  };

  // Remove a product when the admin confirms
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      flash('Đã xóa sản phẩm.');
      await loadProducts();
      onChanged?.();
    } catch (error) {
      flash('Không thể xóa sản phẩm.', 'error');
    }
  };

  const listedProducts = useMemo(() => products.slice().sort((a, b) => b.id - a.id), [products]);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Quản lý sản phẩm</h2>
          <p>Tạo mới, chỉnh sửa hoặc xóa sản phẩm trong menu chính.</p>
        </div>
        <button className="btn ghost" type="button" onClick={() => { setForm(emptyProductForm); setEditingId(null); }}>
          Làm mới form
        </button>
      </div>
      <div className="panel-body">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Tên sản phẩm</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="field">
            <span>Giá (VND)</span>
            <input type="number" min="0" step="1000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </label>
          <label className="field">
            <span>Danh mục</span>
            <input
              list="category-suggestions"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Latte, Cold Brew…"
            />
            <datalist id="category-suggestions">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Tồn kho</span>
            <input type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
          </label>
          <label className="field">
            <span>Hình ảnh (URL)</span>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </label>
          <label className="field">
            <span>Trạng thái</span>
            <div className="field-switch">
              <label className="field-switch-toggle">
                <input
                  type="checkbox"
                  checked={form.in_stock}
                  onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                />
                <span className="field-switch-slider"></span>
              </label>
              <span className="field-switch-status">{form.in_stock ? 'Còn hàng' : 'Hết hàng'}</span>
            </div>
          </label>
          <label className="field field-full">
            <span>Mô tả</span>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="field field-full">
            <button className="btn primary" type="submit">{editingId ? 'Cập nhật' : 'Tạo mới'}</button>
          </div>
        </form>

        <Alert type={alert?.type} message={alert?.message} />
        {loading ? (
          <p className="muted">Đang tải danh sách sản phẩm…</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category || '-'}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock_quantity ?? 0}</td>
                    <td>
                      <span className={`badge ${product.in_stock ? 'success' : 'warning'}`}>
                        {product.in_stock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button type="button" className="btn ghost" onClick={() => handleEdit(product)}>
                        Sửa
                      </button>
                      <button type="button" className="btn danger" onClick={() => handleDelete(product.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Orders({ onChanged }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch latest orders for the admin screen
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listOrders();
      setOrders(data);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Update order status via the admin API
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrder(orderId, { status: newStatus });
      await loadOrders();
      onChanged?.();
    } catch (err) {
      setError('Không thể cập nhật trạng thái đơn hàng.');
    } finally {
      setUpdatingId(null);
    }
  };

  const parseItems = (items) => {
    try {
      return JSON.parse(items || '[]');
    } catch (error) {
      return [];
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Đơn hàng</h2>
          <p>Theo dõi trạng thái và cập nhật tiến trình giao hàng.</p>
        </div>
        <button className="btn ghost" type="button" onClick={loadOrders}>
          Làm mới
        </button>
      </div>
      <div className="panel-body">
        <Alert type={error ? 'error' : undefined} message={error} />
        {loading ? (
          <p className="muted">Đang tải dữ liệu đơn hàng…</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Sản phẩm</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const items = parseItems(order.items);
                  return (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <strong>{order.customer_name}</strong>
                        <span className="muted">{order.customer_email}</span>
                      </td>
                      <td>{formatCurrency(order.total_amount)}</td>
                      <td>
                        {items.length === 0 ? (
                          <span className="muted">Không có mục</span>
                        ) : (
                          <ul className="item-list">
                            {items.map((item) => (
                              <li key={`${order.id}-${item.product_id}`}>{item.product_name} × {item.quantity}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{formatDateTime(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Warehouse({ onChanged }) {
  const [summary, setSummary] = useState([]);
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyMovementForm);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [productPickerOpen, setProductPickerOpen] = useState(false);

  // Load stock snapshot plus the latest movement feed
  const loadWarehouse = useCallback(async () => {
    setLoading(true);
    setAlert(null);
    try {
      const [summaryData, movementData, productData] = await Promise.all([
        inventorySummary(),
        inventoryMovements(),
        listProducts(),
      ]);
      setSummary(summaryData);
      setMovements(movementData.slice(0, 12));
      setProducts(productData);
    } catch (err) {
      setAlert({ type: 'error', message: 'Không thể tải dữ liệu kho.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWarehouse();
  }, [loadWarehouse]);

  // Submit an import/export movement
  const submitMovement = async (event) => {
    event.preventDefault();
    if (!form.product_id || !form.quantity) return;
    setAlert(null);
    const payload = {
      product_id: parseInt(form.product_id, 10),
      quantity: parseInt(form.quantity, 10),
      note: form.note.trim(),
    };

    try {
      if (form.type === 'import') {
        await inventoryImport(payload);
      } else {
        await inventoryExport(payload);
      }
      setForm({ ...form, quantity: '', note: '' });
      await loadWarehouse();
      onChanged?.();
      setAlert({ type: 'success', message: 'Đã cập nhật tồn kho.' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Không thể cập nhật tồn kho.' });
    }
  };

  const productListSize = Math.min(6, Math.max(products.length || 0, 1));

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Kho hàng</h2>
          <p>Nhập/xuất và xem lịch sử luân chuyển nguyên liệu.</p>
        </div>
        <button className="btn ghost" type="button" onClick={loadWarehouse}>
          Làm mới
        </button>
      </div>
      <div className="panel-body">
        <form className="form-inline" onSubmit={submitMovement}>
          <select
            value={form.product_id}
            onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            required
            style={{ minWidth: '190px' }}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            placeholder="Số lượng"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="import">Nhập kho</option>
            <option value="export">Xuất kho</option>
          </select>
          <input placeholder="Ghi chú" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button className="btn primary" type="submit">
            Thực hiện
          </button>
        </form>

        <Alert type={alert?.type} message={alert?.message} />

        {loading ? (
          <p className="muted">Đang tải dữ liệu kho…</p>
        ) : (
          <div className="warehouse-grid">
            <div className="table-wrapper">
              <h3>Tồn kho hiện tại</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sản phẩm</th>
                    <th>Tồn</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((item) => (
                    <tr key={item.product_id}>
                      <td>{item.product_id}</td>
                      <td>{item.product_name}</td>
                      <td>{item.stock_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-wrapper">
              <h3>Lịch sử gần đây</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sản phẩm</th>
                    <th>Loại</th>
                    <th>SL</th>
                    <th>Ghi chú</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((move) => {
                    const product = products.find((p) => p.id === move.product_id);
                    return (
                      <tr key={move.id}>
                        <td>{move.id}</td>
                        <td>{product ? product.name : move.product_id}</td>
                        <td>
                          <span className={`badge ${move.type === 'import' ? 'success' : 'warning'}`}>
                            {move.type === 'import' ? 'Nhập' : 'Xuất'}
                          </span>
                        </td>
                        <td>{move.quantity_change}</td>
                        <td>{move.note || '-'}</td>
                        <td>{formatDateTime(move.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productCount: 0,
    pendingOrders: 0,
    revenue: 0,
    inventoryCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const adminName = localStorage.getItem('admin_name') || 'Admin';

  // Aggregate data for the top statistic cards
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const [products, orders, inventory] = await Promise.all([
        listProducts(),
        listOrders(),
        inventorySummary(),
      ]);
      const pendingOrders = orders.filter((order) => order.status === 'pending').length;
      const revenue = orders.reduce((total, order) => total + (order.total_amount || 0), 0);
      const inventoryCount = inventory.reduce((total, item) => total + (item.stock_quantity || 0), 0);
      setStats({
        productCount: products.length,
        pendingOrders,
        revenue,
        inventoryCount,
      });
    } catch (err) {
      setStatsError('Không thể tải số liệu tổng quan.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
     localStorage.removeItem('admin_name');
    navigate('/login');
  };

  const handleDataChanged = () => {
    fetchStats();
  };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/imge/logocatnen.png" alt="DazzyCoffee" className="sidebar-logo" />
          <div className="brand-text">
            <strong>DazzyCoffee</strong>
            <span>Admin Console</span>
          </div>
        </div>
        <nav>
          <NavLink end to="" className={({ isActive }) => (isActive ? 'active' : '')}>
            Sản phẩm
          </NavLink>
          <NavLink to="orders" className={({ isActive }) => (isActive ? 'active' : '')}>
            Đơn hàng
          </NavLink>
          <NavLink to="warehouse" className={({ isActive }) => (isActive ? 'active' : '')}>
            Kho hàng
          </NavLink>
        </nav>
      </aside>

      <main className="shell-content">
        <header className="topbar">
          <div>
            <p className="auth-kicker">Realtime cockpit</p>
            <h1>Trang quản trị Coffee Shop</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" className="btn ghost" onClick={fetchStats}>
              Làm mới số liệu
            </button>
            <div className="profile-chip">
              <div className="profile-info">
                <div className="profile-icon">
                  <UserIcon />
                </div>
                <div className="profile-text">
                  <small>Xin chào</small>
                  <strong>{adminName}</strong>
                </div>
              </div>
              <button type="button" className="profile-logout" onClick={handleLogout}>
                <span className="logout-icon">
                  <LogoutIcon />
                </span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {statsError && <Alert type="error" message={statsError} />}
        <section className="stat-grid">
          <StatCard title="Sản phẩm" value={statsLoading ? '…' : stats.productCount} subtitle="Số item đang bán" accent="amber" />
          <StatCard title="Đơn chờ" value={statsLoading ? '…' : stats.pendingOrders} subtitle="Cần xử lý" accent="pink" />
          <StatCard title="Doanh thu" value={statsLoading ? '…' : formatCurrency(stats.revenue)} subtitle="Tổng theo ngày" accent="emerald" />
          <StatCard title="Tồn kho" value={statsLoading ? '…' : stats.inventoryCount} subtitle="Tổng số lượng" accent="blue" />
        </section>

        <Routes>
          <Route index element={<Products onChanged={handleDataChanged} />} />
          <Route path="orders" element={<Orders onChanged={handleDataChanged} />} />
          <Route path="warehouse" element={<Warehouse onChanged={handleDataChanged} />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </main>
    </div>
  );
}
