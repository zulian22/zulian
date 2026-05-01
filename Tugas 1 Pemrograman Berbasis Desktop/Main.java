import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        // Data menu (Array)
        Menu[] menu = {
            new Menu("Nasi Goreng", 20000, "Makanan"),
            new Menu("Mie Ayam", 15000, "Makanan"),
            new Menu("Ayam Bakar", 30000, "Makanan"),
            new Menu("Ayam Geprek", 25000, "Makanan"),

            new Menu("Es Teh", 5000, "Minuman"),
            new Menu("Jus Jeruk", 10000, "Minuman"),
            new Menu("Kopi Hitam", 8000, "Minuman"),
            new Menu("Milkshake", 15000, "Minuman")
        };

        // Menampilkan menu
        System.out.println("=== MENU MAKANAN ===");
        System.out.println("1. " + menu[0].nama + " - " + menu[0].harga);
        System.out.println("2. " + menu[1].nama + " - " + menu[1].harga);
        System.out.println("3. " + menu[2].nama + " - " + menu[2].harga);
        System.out.println("4. " + menu[3].nama + " - " + menu[3].harga);

        System.out.println("\n=== MENU MINUMAN ===");
        System.out.println("5. " + menu[4].nama + " - " + menu[4].harga);
        System.out.println("6. " + menu[5].nama + " - " + menu[5].harga);
        System.out.println("7. " + menu[6].nama + " - " + menu[6].harga);
        System.out.println("8. " + menu[7].nama + " - " + menu[7].harga);

        // Pemesanan (maks 4)
        int[] pilihan = new int[4];
        int[] jumlah = new int[4];

        System.out.println("\nMasukkan pesanan");

        // tanpa loop → input satu per satu
        System.out.print("Pesanan 1 (nomor menu): ");
        pilihan[0] = input.nextInt();
        System.out.print("Jumlah: ");
        jumlah[0] = input.nextInt();

        System.out.print("Pesanan 2 (nomor menu): ");
        pilihan[1] = input.nextInt();
        System.out.print("Jumlah: ");
        jumlah[1] = input.nextInt();

        System.out.print("Pesanan 3 (nomor menu): ");
        pilihan[2] = input.nextInt();
        System.out.print("Jumlah: ");
        jumlah[2] = input.nextInt();

        System.out.print("Pesanan 4 (nomor menu): ");
        pilihan[3] = input.nextInt();
        System.out.print("Jumlah: ");
        jumlah[3] = input.nextInt();

        // Hitung total
        int total = 0;
        int totalMinuman = 0;

        int harga1 = menu[pilihan[0]-1].harga * jumlah[0];
        int harga2 = menu[pilihan[1]-1].harga * jumlah[1];
        int harga3 = menu[pilihan[2]-1].harga * jumlah[2];
        int harga4 = menu[pilihan[3]-1].harga * jumlah[3];

        total = harga1 + harga2 + harga3 + harga4;

        // Cek minuman untuk promo B1G1
        if(menu[pilihan[0]-1].kategori.equals("Minuman"))
            totalMinuman += harga1;
        if(menu[pilihan[1]-1].kategori.equals("Minuman"))
            totalMinuman += harga2;
        if(menu[pilihan[2]-1].kategori.equals("Minuman"))
            totalMinuman += harga3;
        if(menu[pilihan[3]-1].kategori.equals("Minuman"))
            totalMinuman += harga4;

        // Diskon
        double diskon = 0;
        if(total > 100000) {
            diskon = total * 0.10;
        }

        // Promo minuman
        double promoMinuman = 0;
        if(total > 50000 && totalMinuman > 0) {
            promoMinuman = totalMinuman * 0.5; // beli 1 gratis 1
        }

        double subtotal = total - diskon - promoMinuman;

        // Pajak dan service
        double pajak = subtotal * 0.10;
        double service = 20000;

        double totalBayar = subtotal + pajak + service;

        // Cetak struk
        System.out.println("\n=== STRUK PEMBAYARAN ===");

        System.out.println(menu[pilihan[0]-1].nama + " x" + jumlah[0] + " = " + harga1);
        System.out.println(menu[pilihan[1]-1].nama + " x" + jumlah[1] + " = " + harga2);
        System.out.println(menu[pilihan[2]-1].nama + " x" + jumlah[2] + " = " + harga3);
        System.out.println(menu[pilihan[3]-1].nama + " x" + jumlah[3] + " = " + harga4);

        System.out.println("\nTotal Awal = " + total);
        System.out.println("Diskon = " + diskon);
        System.out.println("Promo Minuman = " + promoMinuman);
        System.out.println("Subtotal = " + subtotal);
        System.out.println("Pajak (10%) = " + pajak);
        System.out.println("Biaya Service = " + service);
        System.out.println("TOTAL BAYAR = " + totalBayar);
    }
}