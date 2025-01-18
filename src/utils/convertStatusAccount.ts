export function convertStatus(status: boolean): string {
  if (status) {
    return 'Đang hoạt động';
  } else {
    return 'Bị khóa';
  }
}
