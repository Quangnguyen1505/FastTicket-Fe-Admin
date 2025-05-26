'use client';

import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/ui/button/Button';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useAppSelector } from '@/redux/hooks';
import { Modal } from '@/components/ui/modal';
import { DiscountRequestCreate, DiscountTypeEnum } from '@/types/discount';
import BasicTableDiscount from '@/components/tables/BasicTableDiscount';
import { addDiscount } from '@/services/discount.service';
import { getAllMovies } from '@/services/movies.service';
import MovieMultiSelect from '@/components/multiSelect';

const DiscountsPage: React.FC = () => {
  const [formData, setFormData] = useState<DiscountRequestCreate>({
    discount_name: '',
    discount_description: '',
    discount_code: '',
    discount_value: 0,
    discount_type: 'PERCENTAGE',
    discount_start_date: '',
    discount_end_date: '',
    discount_max_uses: 0,
    discount_min_booking_amount: 0,
    discount_is_active: true,
    movie_ids: [],
  });

  const [movies, setMovies] = useState<{ id: string; movie_title: string }[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shopId, accessToken } = useAppSelector((state) => state.auth);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        if (!shopId || !accessToken) return;
        
        const res = await getAllMovies({});
        console.log('Movies:', res);
        const moviesData = res.metadata || [];
        const formattedMovies = moviesData.map((movie: { id: string; movie_title: string }) => ({
          id: movie.id,
          movie_title: movie.movie_title,
        }));
        setMovies(formattedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    }

    fetchAllMovies();
  }, [shopId, accessToken]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      discount_name: '',
      discount_description: '',
      discount_code: '',
      discount_value: 0,
      discount_type: 'PERCENTAGE',
      discount_start_date: '',
      discount_end_date: '',
      discount_max_uses: 0,
      discount_min_booking_amount: 0,
      discount_is_active: true,
      movie_ids: [],
    });
  };

  const handleAddDiscount = async () => {
    try {
      if (!shopId || !accessToken) return;
      const discountTypeNumber =
        formData.discount_type === 'PERCENTAGE' ? DiscountTypeEnum.PERCENTAGE : DiscountTypeEnum.AMOUNT;
      const payload = {
      ...formData,
      discount_type: discountTypeNumber,
    };

      await addDiscount(shopId, accessToken, payload);
      setRefreshTrigger(prev => prev + 1);
      closeModal();
    } catch (error) {
      console.error('Lỗi khi thêm discount:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('discount_value') || 
              name.includes('discount_max_uses') || 
              name.includes('discount_min_booking_amount') 
              ? Number(value) 
              : value
    }));
  };

  const handleDateChange = (name: 'discount_start_date' | 'discount_end_date', dateString: string) => {
    const date = new Date(dateString);
    setFormData(prev => ({
      ...prev,
      [name]: date.toISOString()
    }));
  };

  return (
    <div className="flex flex-col space-y-6 px-6 py-4">
      <PageBreadcrumb pageTitle="Quản lý mã giảm giá" />
      <ComponentCard
        title={
          <div className="flex items-center gap-10">
            <span className="text-base font-semibold">Danh sách mã giảm giá</span>
            <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
              Thêm mã giảm giá mới +
            </Button>
          </div>
        }
      >
        <BasicTableDiscount allMovies={movies.map(movie => ({ id: movie.id, title: movie.movie_title }))} refreshTrigger={refreshTrigger} />
      </ComponentCard>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[600px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar gap-4">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 text-xl lg:text-2xl">
              Thêm mã giảm giá mới
            </h5>
            <p className="text-sm text-gray-500">
              Nhập thông tin mã giảm giá mới
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Tên mã giảm giá</label>
              <input
                name="discount_name"
                value={formData.discount_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Mã giảm giá</label>
              <input
                name="discount_code"
                value={formData.discount_code}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Giá trị</label>
                <input
                  type="number"
                  name="discount_value"
                  value={formData.discount_value}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Loại</label>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="PERCENTAGE">Phần trăm</option>
                  <option value="AMOUNT">Giá trị cố định</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
                <input
                  type="datetime-local"
                  name="discount_start_date"
                  value={formData.discount_start_date ? formData.discount_start_date.slice(0,16) : ''}
                  onChange={(e) => handleDateChange('discount_start_date', e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
                <input
                  type="datetime-local"
                  name="discount_end_date"
                  value={formData.discount_end_date ? formData.discount_end_date.slice(0,16) : ''}
                  onChange={(e) => handleDateChange('discount_end_date', e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Số lượt dùng tối đa</label>
                <input
                  type="number"
                  name="discount_max_uses"
                  value={formData.discount_max_uses}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Giá trị đơn tối thiểu</label>
                <input
                  type="number"
                  name="discount_min_booking_amount"
                  value={formData.discount_min_booking_amount}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Mô tả</label>
              <textarea
                name="discount_description"
                value={formData.discount_description}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <MovieMultiSelect
              movies={movies}
              selectedMovieIds={formData.movie_ids}
              setSelectedMovieIds={(ids) => setFormData(prev => ({ ...prev, movie_ids: ids }))}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="discount_is_active"
                checked={formData.discount_is_active}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  discount_is_active: e.target.checked
                }))}
              />
              <label className="text-sm font-medium">Kích hoạt</label>
            </div>
          </div>

          <div className="flex gap-3 mt-4 justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium border rounded-lg"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleAddDiscount}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
            >
              Tạo mã giảm giá
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DiscountsPage;