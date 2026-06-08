'use client';

import React, { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useServiceDevices } from '@/hooks/useServiceDevices';
import { useMenus } from '@/hooks/useMenus';
import { useSettings } from '@/hooks/useSettings';
import { useTips } from '@/hooks/useTips';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const auth = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push('/login');
    }
  }, [auth.loading, auth.user, router]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'services' | 'categories' | 'menus' | 'tips' | 'settings'>('services');

  // Hooks data loading
  const { categories, createCategory, loading: loadingCats, refresh: refreshCats } = useCategories();
  const { serviceDevices, createServiceDevice, updateServiceDevice, removeServiceDevice, loading: loadingServices, refresh: refreshServices } = useServiceDevices();
  const { menus, createMenu, updateMenu, removeMenu, loading: loadingMenus, refresh: refreshMenus } = useMenus();
  const { settings, updateSetting, loading: loadingSettings, refresh: refreshSettings } = useSettings();
  const { tips, createTip, updateTip, removeTip, loading: loadingTips, refresh: refreshTips } = useTips();

  // ----------------------------------------------------
  // STATES FOR EDIT/CREATE MODALS & FORMS
  // ----------------------------------------------------

  // Category Forms
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Service Device Forms
  const [serviceForm, setServiceForm] = useState({
    id: '',
    name: '',
    brand: '',
    modelNumber: '',
    serialNumber: '',
    description: '',
    price: '',
    rating: 5.0,
    icon: 'bi-snow',
    content: '',
    categoryId: '',
  });
  const [isEditService, setIsEditService] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Menu Forms
  const [menuForm, setMenuForm] = useState({
    id: '',
    title: '',
    url: '',
    icon: 'bi-link-45deg',
    sortOrder: 0,
    isActive: true,
  });
  const [isEditMenu, setIsEditMenu] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  // Tip Forms
  const [tipForm, setTipForm] = useState({
    id: '',
    title: '',
    shortDescription: '',
    content: '',
    imageUrl: '',
    author: 'Kỹ thuật viên DMS',
    isActive: true,
  });
  const [isEditTip, setIsEditTip] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);

  // Status Alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto clear alerts
  const triggerAlert = (success: string | null, error: string | null) => {
    setSuccessMsg(success);
    setErrorMsg(error);
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorMsg(null);
    }, 4000);
  };

  // Pre-fill first category ID when lists load
  useEffect(() => {
    if (categories.length > 0 && !serviceForm.categoryId) {
      setServiceForm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, serviceForm.categoryId]);

  if (auth.loading || !auth.user) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Đang kiểm tra quyền truy cập admin...</p>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUBMIT HANDLERS
  // ----------------------------------------------------

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      await createCategory({ name: catName, description: catDesc });
      setCatName('');
      setCatDesc('');
      triggerAlert('Đã tạo danh mục mới thành công!', null);
      refreshCats();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi tạo danh mục.');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditService) {
        await updateServiceDevice(serviceForm.id, {
          ...serviceForm,
          rating: Number(serviceForm.rating) || 5.0,
          isActive: true, // default active
        });
        triggerAlert('Cập nhật dịch vụ thành công!', null);
      } else {
        await createServiceDevice({
          name: serviceForm.name,
          brand: serviceForm.brand,
          modelNumber: serviceForm.modelNumber || undefined,
          serialNumber: serviceForm.serialNumber || undefined,
          description: serviceForm.description || undefined,
          price: serviceForm.price || undefined,
          rating: Number(serviceForm.rating) || 5.0,
          icon: serviceForm.icon || 'bi-snow',
          content: serviceForm.content || undefined,
          categoryId: serviceForm.categoryId,
        });
        triggerAlert('Tạo dịch vụ mới thành công!', null);
      }
      setShowServiceModal(false);
      refreshServices();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi lưu dịch vụ.');
    }
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMenu) {
        await updateMenu(menuForm.id, {
          ...menuForm,
          sortOrder: Number(menuForm.sortOrder) || 0,
        });
        triggerAlert('Cập nhật menu thành công!', null);
      } else {
        await createMenu({
          title: menuForm.title,
          url: menuForm.url,
          icon: menuForm.icon || undefined,
          sortOrder: Number(menuForm.sortOrder) || 0,
        });
        triggerAlert('Tạo menu mới thành công!', null);
      }
      setShowMenuModal(false);
      refreshMenus();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi lưu menu.');
    }
  };

  const handleSaveTip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditTip) {
        await updateTip(tipForm.id, {
          ...tipForm,
        });
        triggerAlert('Cập nhật bài viết mẹo vặt thành công!', null);
      } else {
        await createTip({
          title: tipForm.title,
          shortDescription: tipForm.shortDescription,
          content: tipForm.content,
          imageUrl: tipForm.imageUrl || undefined,
          author: tipForm.author || 'Kỹ thuật viên DMS',
        });
        triggerAlert('Tạo bài viết mẹo vặt mới thành công!', null);
      }
      setShowTipModal(false);
      refreshTips();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi lưu bài viết.');
    }
  };

  const handleUpdateSettingValue = async (id: string, value: string) => {
    try {
      await updateSetting(id, { id, value });
      triggerAlert('Cập nhật cấu hình thành công!', null);
      refreshSettings();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi cập nhật cấu hình.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;
    try {
      await removeServiceDevice(id);
      triggerAlert('Đã xóa dịch vụ thành công!', null);
      refreshServices();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi xóa dịch vụ.');
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục menu này?')) return;
    try {
      await removeMenu(id);
      triggerAlert('Đã xóa menu thành công!', null);
      refreshMenus();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi xóa menu.');
    }
  };

  const handleDeleteTip = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await removeTip(id);
      triggerAlert('Đã xóa bài viết thành công!', null);
      refreshTips();
    } catch (err: any) {
      triggerAlert(null, err.message || 'Lỗi khi xóa bài viết.');
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h1 className="fw-bold m-0 text-dark">Bảng Điều Khiển Admin</h1>
          <p className="text-muted m-0">Quản lý nội dung hệ thống điện lạnh DMS</p>
        </div>
        <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => auth.logout()}>
          <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
        </button>
      </div>

      {/* Alerts */}
      {successMsg && <div className="alert alert-success rounded-3 shadow-sm">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger rounded-3 shadow-sm">{errorMsg}</div>}

      {/* Admin Tab Navigation */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-2 bg-white rounded-4">
          <ul className="nav nav-pills nav-fill gap-2">
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('services')}
                className={`nav-link rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'services' ? 'active' : 'text-dark'}`}
              >
                <i className="bi bi-snow2"></i> Quản lý Dịch vụ
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('categories')}
                className={`nav-link rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'categories' ? 'active' : 'text-dark'}`}
              >
                <i className="bi bi-tags-fill"></i> Danh mục Thiết bị
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('menus')}
                className={`nav-link rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'menus' ? 'active' : 'text-dark'}`}
              >
                <i className="bi bi-list-nested"></i> Thanh Menu
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('tips')}
                className={`nav-link rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'tips' ? 'active' : 'text-dark'}`}
              >
                <i className="bi bi-journal-text"></i> Quản lý Mẹo vặt
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab('settings')}
                className={`nav-link rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'settings' ? 'active' : 'text-dark'}`}
              >
                <i className="bi bi-sliders"></i> Cấu hình Thông tin
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="card border-0 shadow-sm rounded-4 p-4 min-height-400 bg-white">
        
        {/* TAB 1: SERVICES */}
        {activeTab === 'services' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0 text-dark">Danh sách Dịch vụ Điện lạnh ({serviceDevices.length})</h4>
              <button 
                className="btn btn-primary rounded-pill px-4" 
                onClick={() => {
                  setIsEditService(false);
                  setServiceForm({
                    id: '',
                    name: '',
                    brand: '',
                    modelNumber: '',
                    serialNumber: '',
                    description: '',
                    price: '',
                    rating: 5.0,
                    icon: 'bi-snow',
                    content: '',
                    categoryId: categories[0]?.id || '',
                  });
                  setShowServiceModal(true);
                }}
              >
                <i className="bi bi-plus-circle-fill me-2"></i> Thêm Dịch vụ mới
              </button>
            </div>

            {loadingServices ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : serviceDevices.length === 0 ? (
              <div className="text-center py-5 text-muted">Chưa có dịch vụ nào được cấu hình trong CSDL.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Tên dịch vụ</th>
                      <th>Hãng/Dòng</th>
                      <th>Danh mục</th>
                      <th>Giá tham khảo</th>
                      <th>Đánh giá</th>
                      <th className="text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceDevices.map((srv: any) => (
                      <tr key={srv.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="bg-primary-subtle text-primary rounded p-2"><i className={`bi ${srv.icon || 'bi-gear-fill'}`}></i></span>
                            <span className="fw-semibold">{srv.name}</span>
                          </div>
                        </td>
                        <td>{srv.brand}</td>
                        <td><span className="badge bg-secondary-subtle text-dark">{srv.categoryName}</span></td>
                        <td className="text-primary fw-bold">{srv.price || 'Khảo sát'}</td>
                        <td><i className="bi bi-star-fill text-warning"></i> {srv.rating || '5.0'}</td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-secondary me-2 rounded-circle" 
                            onClick={() => {
                              setIsEditService(true);
                              setServiceForm({
                                id: srv.id,
                                name: srv.name,
                                brand: srv.brand,
                                modelNumber: srv.modelNumber || '',
                                serialNumber: srv.serialNumber || '',
                                description: srv.description || '',
                                price: srv.price || '',
                                rating: srv.rating || 5.0,
                                icon: srv.icon || 'bi-snow',
                                content: srv.content || '',
                                categoryId: srv.categoryId,
                              });
                              setShowServiceModal(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteService(srv.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <div className="row g-4">
              <div className="col-lg-4">
                <h4 className="fw-bold mb-3">Tạo Danh Mục Mới</h4>
                <form onSubmit={handleCreateCategory} className="border p-3 rounded-4 bg-light">
                  <div className="mb-3">
                    <label className="form-label font-medium small">Tên danh mục *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      placeholder="VD: Máy lạnh inverter, tủ đông..."
                      value={catName} 
                      onChange={(e) => setCatName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label font-medium small">Mô tả</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows={3}
                      placeholder="Mô tả kỹ thuật cho danh mục"
                      value={catDesc} 
                      onChange={(e) => setCatDesc(e.target.value)} 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 rounded-pill py-2">
                    Tạo danh mục
                  </button>
                </form>
              </div>

              <div className="col-lg-8">
                <h4 className="fw-bold mb-3">Danh sách Danh mục hiện có ({categories.length})</h4>
                {loadingCats ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : categories.length === 0 ? (
                  <p className="text-muted">Chưa có danh mục nào được cấu hình.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Tên danh mục</th>
                          <th>Mô tả</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((cat) => (
                          <tr key={cat.id}>
                            <td className="fw-semibold">{cat.name}</td>
                            <td>{cat.description || 'Không có mô tả'}</td>
                            <td>
                              <span className={`badge ${cat.isActive ? 'bg-success' : 'bg-danger'}`}>
                                {cat.isActive ? 'Hoạt động' : 'Tạm dừng'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MENUS */}
        {activeTab === 'menus' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0 text-dark">Quản lý Menu chính ({menus.length})</h4>
              <button 
                className="btn btn-primary rounded-pill px-4" 
                onClick={() => {
                  setIsEditMenu(false);
                  setMenuForm({
                    id: '',
                    title: '',
                    url: '',
                    icon: 'bi-link-45deg',
                    sortOrder: menus.length + 1,
                    isActive: true,
                  });
                  setShowMenuModal(true);
                }}
              >
                <i className="bi bi-plus-circle-fill me-2"></i> Thêm menu mới
              </button>
            </div>

            {loadingMenus ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : menus.length === 0 ? (
              <div className="text-center py-5 text-muted">Chưa cấu hình menu nào.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Tiêu đề hiển thị</th>
                      <th>Đường dẫn (URL)</th>
                      <th>Thứ tự</th>
                      <th>Trạng thái</th>
                      <th className="text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus.map((menu: any) => (
                      <tr key={menu.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {menu.icon && <span className="bg-light p-2 rounded"><i className={`bi ${menu.icon}`}></i></span>}
                            <span className="fw-semibold">{menu.title}</span>
                          </div>
                        </td>
                        <td><code>{menu.url}</code></td>
                        <td>{menu.sortOrder}</td>
                        <td>
                          <span className={`badge ${menu.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {menu.isActive ? 'Hiển thị' : 'Ẩn'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-secondary me-2 rounded-circle" 
                            onClick={() => {
                              setIsEditMenu(true);
                              setMenuForm({
                                id: menu.id,
                                title: menu.title,
                                url: menu.url,
                                icon: menu.icon || 'bi-link-45deg',
                                sortOrder: menu.sortOrder,
                                isActive: menu.isActive,
                              });
                              setShowMenuModal(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteMenu(menu.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TIPS */}
        {activeTab === 'tips' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold m-0 text-dark">Danh sách Mẹo vặt / Cẩm nang ({tips.length})</h4>
              <button 
                className="btn btn-primary rounded-pill px-4" 
                onClick={() => {
                  setIsEditTip(false);
                  setTipForm({
                    id: '',
                    title: '',
                    shortDescription: '',
                    content: '',
                    imageUrl: '',
                    author: 'Kỹ thuật viên DMS',
                    isActive: true,
                  });
                  setShowTipModal(true);
                }}
              >
                <i className="bi bi-plus-circle-fill me-2"></i> Thêm bài viết mới
              </button>
            </div>

            {loadingTips ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : tips.length === 0 ? (
              <div className="text-center py-5 text-muted">Chưa cấu hình mẹo vặt nào.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Tiêu đề bài viết</th>
                      <th>Mô tả ngắn</th>
                      <th>Tác giả</th>
                      <th>Trạng thái</th>
                      <th className="text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tips.map((tip: any) => (
                      <tr key={tip.id}>
                        <td className="fw-semibold" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tip.title}
                        </td>
                        <td className="text-muted small" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tip.shortDescription}
                        </td>
                        <td>{tip.author}</td>
                        <td>
                          <span className={`badge ${tip.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {tip.isActive ? 'Kích hoạt' : 'Ẩn'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-secondary me-2 rounded-circle" 
                            onClick={() => {
                              setIsEditTip(true);
                              setTipForm({
                                id: tip.id,
                                title: tip.title,
                                shortDescription: tip.shortDescription,
                                content: tip.content,
                                imageUrl: tip.imageUrl || '',
                                author: tip.author,
                                isActive: tip.isActive,
                              });
                              setShowTipModal(true);
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleDeleteTip(tip.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h4 className="fw-bold mb-4">Thông tin doanh nghiệp & Cấu hình Hệ thống</h4>
            {loadingSettings ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : settings.length === 0 ? (
              <div className="text-center py-5 text-muted">Chưa có thông tin cấu hình hệ thống nào trong CSDL.</div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {settings.map((set: any) => (
                  <div key={set.id} className="row align-items-center border-bottom pb-3">
                    <div className="col-md-3">
                      <span className="fw-bold text-dark">{set.key}</span>
                      <small className="d-block text-muted">{set.description}</small>
                    </div>
                    <div className="col-md-7">
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        defaultValue={set.value} 
                        onBlur={(e) => {
                          if (e.target.value !== set.value) {
                            handleUpdateSettingValue(set.id, e.target.value);
                          }
                        }} 
                      />
                    </div>
                    <div className="col-md-2 text-md-end text-muted small">
                      Tự động lưu khi trỏ ra ngoài
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          MODALS USING CUSTOM BOOTSTRAP OVERLAYS
          ---------------------------------------------------- */}

      {/* Service Device Modal */}
      {showServiceModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4">
              <form onSubmit={handleSaveService}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{isEditService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowServiceModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small">Tên dịch vụ *</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        value={serviceForm.name} 
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Hãng/Dòng thiết bị *</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        placeholder="VD: Daikin, Panasonic, hoặc Dân dụng"
                        value={serviceForm.brand} 
                        onChange={(e) => setServiceForm({ ...serviceForm, brand: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small">Giá tham khảo</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        placeholder="VD: 150.000đ"
                        value={serviceForm.price} 
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Đánh giá (1-5)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="1" 
                        max="5"
                        className="form-control rounded-3" 
                        value={serviceForm.rating} 
                        onChange={(e) => setServiceForm({ ...serviceForm, rating: parseFloat(e.target.value) || 5.0 })} 
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small">Danh mục liên kết *</label>
                      <select 
                        className="form-select rounded-3" 
                        value={serviceForm.categoryId}
                        onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Icon (Bootstrap Icon class)</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        placeholder="VD: bi-snow, bi-tools"
                        value={serviceForm.icon} 
                        onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Mô tả ngắn dịch vụ</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows={2} 
                      value={serviceForm.description} 
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Nội dung chi tiết trang Dịch vụ (HTML hỗ trợ)</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows={5} 
                      placeholder="Nhập nội dung kỹ thuật chi tiết hiển thị ở trang dịch vụ riêng lẻ..."
                      value={serviceForm.content} 
                      onChange={(e) => setServiceForm({ ...serviceForm, content: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowServiceModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Lưu cấu hình</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <form onSubmit={handleSaveMenu}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{isEditMenu ? 'Sửa menu' : 'Thêm menu mới'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowMenuModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small">Tiêu đề menu *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      value={menuForm.title} 
                      onChange={(e) => setMenuForm({ ...menuForm, title: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Đường dẫn (URL) *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      placeholder="VD: /, /categories, #contact"
                      value={menuForm.url} 
                      onChange={(e) => setMenuForm({ ...menuForm, url: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col">
                      <label className="form-label small">Thứ tự sắp xếp *</label>
                      <input 
                        type="number" 
                        className="form-control rounded-3" 
                        value={menuForm.sortOrder} 
                        onChange={(e) => setMenuForm({ ...menuForm, sortOrder: parseInt(e.target.value) || 0 })} 
                        required 
                      />
                    </div>
                    <div className="col">
                      <label className="form-label small">Hiển thị</label>
                      <select 
                        className="form-select rounded-3" 
                        value={menuForm.isActive ? 'true' : 'false'}
                        onChange={(e) => setMenuForm({ ...menuForm, isActive: e.target.value === 'true' })}
                      >
                        <option value="true">Bật</option>
                        <option value="false">Tắt (Ẩn)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Icon (Bootstrap Icon class)</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      placeholder="VD: bi-link, bi-house"
                      value={menuForm.icon} 
                      onChange={(e) => setMenuForm({ ...menuForm, icon: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowMenuModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Lưu cấu hình</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4">
              <form onSubmit={handleSaveTip}>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{isEditTip ? 'Sửa bài viết mẹo vặt' : 'Tạo bài viết mẹo vặt mới'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowTipModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small">Tiêu đề bài viết *</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      value={tipForm.title} 
                      onChange={(e) => setTipForm({ ...tipForm, title: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small">Tác giả</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        value={tipForm.author} 
                        onChange={(e) => setTipForm({ ...tipForm, author: e.target.value })} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Ảnh bìa (URL)</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3" 
                        placeholder="Link ảnh Unsplash hoặc địa chỉ ảnh..."
                        value={tipForm.imageUrl} 
                        onChange={(e) => setTipForm({ ...tipForm, imageUrl: e.target.value })} 
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Mô tả ngắn *</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows={2} 
                      value={tipForm.shortDescription} 
                      onChange={(e) => setTipForm({ ...tipForm, shortDescription: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Nội dung chi tiết cẩm nang (HTML hỗ trợ) *</label>
                    <textarea 
                      className="form-control rounded-3" 
                      rows={7} 
                      value={tipForm.content} 
                      onChange={(e) => setTipForm({ ...tipForm, content: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowTipModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Lưu cẩm nang</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
