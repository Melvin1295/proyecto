<?php require_once(dirname(__FILE__) . "/escpos-php-master/Escpos.php");
              //$logo = new EscposImage("images/productos/tostao.jpg");

              $printer = new Escpos();
              /* Print top logo */
                            $printer -> setJustification(Escpos::JUSTIFY_CENTER);
                            
                             $printer ->  setEmphasis(true);
                             $printer -> selectPrintMode(Escpos::MODE_DOUBLE_HEIGHT);  

                             $printer -> text("* GO HARD NUTRITION *\n");

                             $printer -> text("GO HARD NUTRITION \n");

                             $printer -> text("E.I.R.L. \n");
                             $printer -> selectPrintMode();
                             $printer -> text("CAv. Josel #2584 Chiclayo-Lambayeque \n");
                             $printer -> text("ruc:12356895648 \n");
                             $printer -> text("BOLETA \n");

                             $printer -> text("001-000007\n");

                             $printer -> text("001-000005\n");
                             $printer -> setEmphasis(false);
                             $printer -> feed();
                             $printer -> setJustification();
              $printer -> setFont(Escpos::FONT_C);

              
              $printer -> text("Fecha:23-04-2016    Hora:21:02:50\n");
              $printer -> text("Tienda:01   Caja:2  Tiket:000031\n");

              $printer -> feed();
              $printer -> text("Fecha:23-04-2016    Hora:18:11:27\n");
              $printer -> text("Tienda:01  #Caja:2 #Tiket:000031\n");

              
              $printer -> text("---------------------------------\n");
              $printer -> text("Cliente: Cliente Ejemplo\n");$printer -> text("DNI N°:\n");
              $printer -> text("Direccion: Dirección de Cliente Ejemplo\n");
              
              $printer -> feed();
              $printer -> feed();
              $printer -> text("Cajero: soporte\n");
              $printer -> text("Vendedor: .....\n");
              $printer -> text("---------------------------------\n");
              $printer -> text("Descripcion \n");

              $printer -> text("Cant.  Precio    Desct.     Total");

              $printer -> text("Cant.  Precio    Descut.    Total \n");

              $printer -> text("---------------------------------\n");
              $printer -> text("Celular(Celular/ CT:100MG /SB:Fresa)\n");
                              
              $printer -> text("1.00   264.00    12.00    264.00\n");
                              $printer -> text("---------------------------------\n");
                              $printer -> text("Cantidad de Articulos:    1\n"); 
                              $printer -> text("Total Descuento:       S/.12\n");

                              $printer -> text("Subtotal:              S/.223.73\n");
                              $printer -> text("IGV(18%):              S/.40.27\n"); 
                              
                              $printer -> text("TOTAL A PAGAR:         S/.264.00\n");
                              $printer -> feed(); 
                              $printer -> text("---------------------------------\n");
                              
                               $printer -> text("Monto P. Tarjeta:      S/.64.00\n"); 
                              $printer -> text("Monto P. Efectivo:     S/.200.00\n");                              
                              $printer -> text("Importe Pagado:        S/.264\n");
                              $printer -> text("Vuelto:                S/.0.00\n"); $printer -> text("Tipo Tarjeta:     Visa\n");                              
                              $printer -> text("---------------------------------\n"); 
                              $printer -> text("Puntos Ganados:           264.00\n");
                              $printer -> text("Puntos Acumulados:        3342.00\n");

                              $printer -> text("Subtotal               S/.223.73\n");
                              $printer -> text("IGV(18%)               S/.40.27\n"); 
                              $printer -> text("descuento especial     S/.0.00\n");
                              $printer -> text("TOTAL A PAGAR          S/.264.00\n");
                              $printer -> feed(); 
                              $printer -> text("---------------------------------\n");
                              $printer -> text("Monto P. Tarjeta       S/.0.00\n"); 
                              $printer -> text("Monto P. Efectivo      S/.264.00\n");                              
                              $printer -> text("Importe Pagado         S/.280\n");
                              $printer -> text("Vuelto                 S/.16.00\n"); 
                              $printer -> text("Tipo Tarjeta:     \n");
                              $printer -> text("---------------------------------\n"); 
                              $printer -> text("Puntos Ganados:           264.00\n");
                              $printer -> text("Puntos Acumulados:        3078.00\n");

                              $printer -> text("---------------------------------\n");
                              $printer -> text("---------------------------------\n");
                              $printer -> text("\n"); 
                              $printer -> text("\n");
                              $printer -> cut();$printer -> pulse(); 
                              $printer -> text("  Aqui algunos productos Cajeables\n");
                              $printer -> text("Celular(Celular/ CT:100MG /SB:Fresa)\n");
                              $printer -> text("Puntos: 5000.00\n");
                      $printer -> text("Celular(Celular/ CT:500Mg /SB:Chocolate)\n");
                              $printer -> text("Puntos: 500.00\n");
                      $printer -> text("producto2(producto2/ CT:500MG /SB:Fresa)\n");
                              $printer -> text("Puntos: 300.00\n");
                      $printer -> text("producto cf\n");
                              $printer -> text("Puntos: 200.00\n");
                      $printer -> text("AMINOX(AMINOX/ CT:435G /SB:WATERMELON /SER:40 SERVICES)\n");
                              $printer -> text("Puntos: 2000.00\n");
                      $printer -> setEmphasis(true);
              $printer -> text("\n");$printer -> text("---------------------------------\n");$printer -> setEmphasis(true);$printer -> text("Para mas informacion comuniquese al:\n");$printer -> text("telf:074209192 Wsp/Rpm:#951831525 \n");$printer -> text("E-mail:\n");$printer -> setEmphasis(false);$printer -> feed();$printer -> feed();$printer -> cut();$printer -> pulse();$printer -> close();