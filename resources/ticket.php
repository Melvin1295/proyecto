<?php require_once(dirname(__FILE__) . "/escpos-php-master/Escpos.php");
              //$logo = new EscposImage("images/productos/tostao.jpg");

              $printer = new Escpos();
              /* Print top logo */
                            $printer -> setJustification(Escpos::JUSTIFY_CENTER);
                            
                             $printer ->  setEmphasis(true);
                             $printer -> selectPrintMode(Escpos::MODE_DOUBLE_HEIGHT);  
                             $printer -> text("* GO HARD NUTRITION *\n");
                             $printer -> text("E.I.R.L. \n");
                             $printer -> selectPrintMode();
                             $printer -> text("C - \n");
                             $printer -> text("ruc: \n");
                             $printer -> text("FACTURA \n");
                             $printer -> text("001-000001\n");
                             $printer -> setEmphasis(false);
                             $printer -> feed();
                             $printer -> setJustification();
              $printer -> setFont(Escpos::FONT_C);
              
              $printer -> text("Fecha:16-08-2016    Hora:21:32:08\n");
              $printer -> text("Tienda:01   Caja:1  Tiket:000002\n");
              
              $printer -> text("---------------------------------\n");
              $printer -> text("Cliente: alexis sac\n");$printer -> text("RUC N°:\n");
              $printer -> text("Direccion: av Grau\n");
              
              
              
              $printer -> feed();
              $printer -> text("Cajero: soporte\n");
              $printer -> text("Vendedor: .....\n");
              $printer -> text("---------------------------------\n");
              $printer -> text("Descripcion \n");
              $printer -> text("Cant.  Precio    Desct.     Total");
              $printer -> text("---------------------------------\n");
              $printer -> text("Essential AmiN.O. Energy(Essential AmiN.O. Energy/ Serv.:30 Serv. /Sabr.:Fruit Punch)\n");
                              
              $printer -> text("1.00   89.00    6.32    89.00\n");
                              $printer -> text("---------------------------------\n");
                              $printer -> text("Cantidad de Articulos:    1\n"); 
                              $printer -> text("Total Descuento:       S/.6.32\n");
                              $printer -> text("Subtotal:              S/.75.42\n");
                              $printer -> text("IGV(18%):              S/.13.58\n"); 
                              
                              $printer -> text("TOTAL A PAGAR:         S/.89.00\n");
                              $printer -> feed(); 
                              $printer -> text("---------------------------------\n");
                              
                               
                              $printer -> text("Monto P. Efectivo:     S/.89.00\n");                              
                              $printer -> text("Importe Pagado:        S/.89\n");
                              $printer -> text("Vuelto:                S/.0.00\n");                               
                              $printer -> text("---------------------------------\n"); 
                              $printer -> text("Puntos Ganados:           89.00\n");
                              $printer -> text("Puntos Acumulados:        425.99\n");
                              $printer -> text("---------------------------------\n");
                              $printer -> text("---------------------------------\n");
                              $printer -> text("\n"); 
                              $printer -> text("\n");
                              $printer -> cut();$printer -> pulse(); 
                              $printer -> text("  Aqui algunos productos Cajeables\n");
                              $printer -> text("Amino Decanate(Amino Decanate/ Serv.:30 Serv. /Sabr.:Citrus Lime)\n");
                              $printer -> text("Puntos: 0.00\n");
                      $printer -> text("Amino X(Amino X/ Serv.:70 Serv. /Sabr.:Watermelon)\n");
                              $printer -> text("Puntos: 0.00\n");
                      $printer -> text("i.LIV Plant Based BCAA(i.LIV Plant Based BCAA/ Serv.:40 Serv. /Sabr.:Mango Coconut)\n");
                              $printer -> text("Puntos: 0.00\n");
                      $printer -> text("i.LIV Plant Based BCAA(i.LIV Plant Based BCAA/ Serv.:40 Serv. /Sabr.:Pineapple)\n");
                              $printer -> text("Puntos: 0.00\n");
                      $printer -> text("i.LIV Plant Based BCAA(i.LIV Plant Based BCAA/ Serv.:40 Serv. /Sabr.:Peach Raspberry)\n");
                              $printer -> text("Puntos: 0.00\n");
                      $printer -> setEmphasis(true);
              $printer -> text("\n");$printer -> text("---------------------------------\n");$printer -> setEmphasis(true);$printer -> text("Para mas informacion comuniquese al:\n");$printer -> text("telf:074209192 Wsp/Rpm:#951831525 \n");$printer -> text("E-mail:\n");$printer -> setEmphasis(false);$printer -> feed();$printer -> feed();$printer -> cut();$printer -> pulse();$printer -> close();