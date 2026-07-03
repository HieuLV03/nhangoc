"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import "./page.css";
import BackButton from "../components/BackButton/BackButton";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH SERVICES
  // =========================
  const fetchServices = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("services")
      .select(
        "id, title, slug, price, status, created_at, image"
      )
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setServices(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // =========================
  // EXTRACT STORAGE PATH
  // =========================
  const extractPath = (url) => {
    if (!url) return null;

    try {
      const parsed = new URL(url);

      const parts = parsed.pathname.split("/images_service/");

      return parts[1] || null;
    } catch {
      return null;
    }
  };

  // =========================
  // DELETE SERVICE
  // =========================
  const deleteService = async (service) => {
    if (!service?.id) {
      alert("Missing service id");
      return;
    }

    const ok = confirm(
      "Bạn có chắc muốn xoá dịch vụ này không?"
    );

    if (!ok) return;

    try {
      // =========================
      // DELETE IMAGE
      // =========================
      if (service.image) {
        const filePath = extractPath(service.image);

        console.log("FILE PATH:", filePath);

        if (filePath) {
          const { error: storageError } =
            await supabase.storage
              .from("images_service")
              .remove([filePath]);

          if (storageError) {
            console.log(
              "Storage error:",
              storageError.message
            );
          }
        }
      }

      // =========================
      // DELETE DATABASE
      // =========================
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", service.id);

      if (error) {
        alert(error.message);
        return;
      }

      // =========================
      // UPDATE UI
      // =========================
      setServices((prev) =>
        prev.filter((s) => s.id !== service.id)
      );

      alert("Đã xoá dịch vụ!");
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div className="adminPage">
    <div className="adminCard">

 <div className="headerRow">
  <div className="headerLeft">
    <BackButton />
    <h1>Danh sách dịch vụ</h1>
  </div>

  <Link
    href="/admin/services/create"
    className="addBtn"
  >
    + Thêm dịch vụ
  </Link>
</div>

      {/* CONTENT */}
      {loading ? (
        <p>Đang tải...</p>
      ) : services.length === 0 ? (
        <p>Chưa có dịch vụ nào</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Slug</th>
              <th>Giá</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.title}</td>

                <td>{service.slug}</td>

                <td>
                  {Number(service.price).toLocaleString("vi-VN")}đ
                </td>

                <td>
                  {service.created_at
                    ? new Date(service.created_at).toLocaleDateString()
                    : ""}
                </td>

                <td>
                  <span className="status">
                    {service.status}
                  </span>
                </td>

                <td className="action">
                  <Link
                    href={`/admin/services/edit/${service.id}`}
                    className="editBtn"
                  >
                    Sửa
                  </Link>

                  <button
                    onClick={() => deleteService(service)}
                    className="deleteBtn"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  </div>
);
}