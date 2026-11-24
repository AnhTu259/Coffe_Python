// Trang quản lý kho dành cho admin:
// - Hiển thị tồn kho hiện tại (summary)
// - Hiển thị lịch sử nhập/xuất (movements)
// - Cho phép nhập kho / xuất kho sản phẩm
// Các API được gọi đều yêu cầu token admin (đã tự động gắn qua axios interceptor ở admin app).
import React, { useEffect, useState } from 'react';
import './Warehouse.css';
import { getProducts, getInventoryMovements, importInventory, exportInventory, getInventorySummary } from '../../services/api';

// Component chính của module Kho
function Warehouse() {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ product_id: '', quantity: '', note: '', type: 'import' });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Tải đồng thời danh sách sản phẩm, tổng tồn kho, và lịch sử nhập xuất
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, s, m] = await Promise.all([
        getProducts(),
        getInventorySummary(),
        getInventoryMovements()
      ]);
      setProducts(p);
      setSummary(s);
      setMovements(m);
    } catch (e) {
      setError('Không tải được dữ liệu kho.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Gửi yêu cầu nhập/xuất kho dựa trên giá trị form.type; hiển thị tiến trình đơn giản
  const submitMovement = async (e) => {
    e.preventDefault();
    if (!form.product_id || !form.quantity) return;
    setError(null);
    setProgress(10);
    try {
      const payload = { product_id: parseInt(form.product_id, 10), quantity: parseInt(form.quantity, 10), note: form.note || '' };
      setProgress(40);
      if (form.type === 'import') {
        await importInventory(payload);
      } else {
        await exportInventory(payload);
      }
      setProgress(80);
      await fetchAll();
      setProgress(100);
      setTimeout(() => setProgress(0), 600);
      setForm({ ...form, quantity: '', note: '' });
    } catch (e) {
      setError('Thao tác kho thất bại');
      setProgress(0);
    }
  };

  return (
    <div className="warehouse-page">
      <h1>Kho hàng</h1>
      {error && <div className="wh-error">{error}</div>}
      {loading && <div className="wh-loading">Đang tải...</div>}

      <form className="wh-form" onSubmit={submitMovement}>
        <div className="row">
          <div className="form-group">
            <select value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} required>
              <option value="">Chọn sản phẩm</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <input type="number" placeholder="Số lượng" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
          <div className="form-group">
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="import">Nhập kho</option>
              <option value="export">Xuất kho</option>
            </select>
          </div>
          <input placeholder="Ghi chú" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          <button type="submit">Thực hiện</button>
        </div>

        {progress > 0 && (
          <div className="progress">
            <div className="bar" style={{ width: `${progress}%` }} />
          </div>
        )}
      </form>

      <div className="wh-grid">
        <div>
          <h2>Tồn kho hiện tại</h2>
          <table className="wh-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Tồn</th>
              </tr>
            </thead>
            <tbody>
              {summary.map(s => (
                <tr key={s.product_id}>
                  <td>{s.product_id}</td>
                  <td>{s.product_name}</td>
                  <td>{s.stock_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Lịch sử nhập/xuất</h2>
          <table className="wh-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sản phẩm</th>
                <th>Loại</th>
                <th>Số lượng</th>
                <th>Ghi chú</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(m => {
                const prod = products.find(p => p.id === m.product_id);
                return (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{prod ? prod.name : m.product_id}</td>
                    <td>{m.type}</td>
                    <td>{m.quantity_change}</td>
                    <td>{m.note || '-'}</td>
                    <td>{new Date(m.created_at).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Warehouse;


